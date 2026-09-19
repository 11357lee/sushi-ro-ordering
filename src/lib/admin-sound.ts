/**
 * Single pending-order alert controller.
 * Uses Web Audio so iPad Safari keeps playing after one unlock gesture
 * (creating a new HTMLAudioElement per play is blocked without another tap).
 */

const SOUND_FILES = {
  asap: "/sounds/order-asap.mp3",
  scheduled: "/sounds/order-scheduled.mp3",
  "customer-cancelled": "/sounds/order-cancelled.mp3",
} as const;

const SOUND_VOLUME = 0.85;
/** Silence between full plays of the pending alert. */
const PENDING_GAP_MS = 5000;
/** After accept/reject clears the queue, ignore pending for a bit so poll can't restart audio. */
const POST_CLEAR_MUTE_MS = 10000;

type SoundKind = keyof typeof SOUND_FILES;
type PendingKind = "asap" | "scheduled";

class AdminSoundController {
  private ctx: AudioContext | null = null;
  private buffers = new Map<SoundKind, AudioBuffer>();
  private unlockPromise: Promise<boolean> | null = null;
  private unlocked = false;
  private gapTimer = 0;
  private muteTimer = 0;
  private generation = 0;
  private active = false;
  private kind: PendingKind | null = null;
  private mutedUntil = 0;
  private currentSource: AudioBufferSourceNode | null = null;
  private oneshotSource: AudioBufferSourceNode | null = null;

  isUnlocked() {
    return this.unlocked;
  }

  /**
   * Must run inside a user gesture (tap/click). Loads buffers and resumes AudioContext.
   * Safe to call repeatedly.
   */
  unlock(): Promise<boolean> {
    if (typeof window === "undefined") return Promise.resolve(false);
    if (this.unlocked && this.ctx?.state === "running") {
      return Promise.resolve(true);
    }
    if (this.unlockPromise) return this.unlockPromise;

    this.unlockPromise = (async () => {
      try {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return false;

        this.ctx = this.ctx ?? new Ctx();
        if (this.ctx.state === "suspended") {
          await this.ctx.resume();
        }

        await Promise.all(
          (Object.keys(SOUND_FILES) as SoundKind[]).map((kind) => this.ensureBuffer(kind))
        );

        // Silent tick so the session is fully primed on iOS.
        const tick = this.ctx.createBuffer(1, 1, this.ctx.sampleRate);
        const source = this.ctx.createBufferSource();
        source.buffer = tick;
        source.connect(this.ctx.destination);
        source.start(0);

        this.unlocked = this.ctx.state === "running";
        return this.unlocked;
      } catch {
        this.unlocked = false;
        return false;
      } finally {
        this.unlockPromise = null;
      }
    })();

    return this.unlockPromise;
  }

  setKind(kind: PendingKind | null) {
    this.kind = kind;
  }

  /** Begin repeating pending alert. Safe to call repeatedly — will not overlap/restart. */
  startPending() {
    if (this.active) return;
    if (!this.kind) return;
    if (Date.now() < this.mutedUntil) {
      window.clearTimeout(this.muteTimer);
      this.muteTimer = window.setTimeout(() => {
        if (this.kind && !this.active && Date.now() >= this.mutedUntil) {
          this.startPending();
        }
      }, Math.max(0, this.mutedUntil - Date.now()) + 50);
      return;
    }
    this.active = true;
    const gen = ++this.generation;
    void this.playPendingCycle(gen);
  }

  /** Hard-stop pending alert. Optionally mute so a subsequent poll cannot restart immediately. */
  stopPending(opts?: { muteMs?: number }) {
    this.active = false;
    this.generation += 1;
    window.clearTimeout(this.gapTimer);
    window.clearTimeout(this.muteTimer);
    this.gapTimer = 0;
    this.muteTimer = 0;
    if (opts?.muteMs && opts.muteMs > 0) {
      this.mutedUntil = Date.now() + opts.muteMs;
    }
    this.stopSource(this.currentSource);
    this.currentSource = null;
  }

  /** Stop everything (logout / leave admin). */
  stopAll() {
    this.stopPending();
    this.mutedUntil = 0;
    this.stopSource(this.oneshotSource);
    this.oneshotSource = null;
  }

  playCancelTwice() {
    const shouldResume = this.active && this.kind !== null;
    this.pausePendingForOneshot();

    const finish = () => {
      this.oneshotSource = null;
      if (shouldResume && this.kind && Date.now() >= this.mutedUntil) {
        this.active = false;
        this.startPending();
      }
    };

    void this.playBuffer("customer-cancelled", (source) => {
      this.oneshotSource = source;
    })
      .then(() => new Promise<void>((r) => window.setTimeout(r, 250)))
      .then(() =>
        this.playBuffer("customer-cancelled", (source) => {
          this.oneshotSource = source;
        })
      )
      .then(finish)
      .catch(finish);
  }

  playTest(kind: PendingKind | "customer-cancelled") {
    if (kind === "customer-cancelled") {
      this.playCancelTwice();
      return;
    }
    this.pausePendingForOneshot();
    void this.playBuffer(kind, (source) => {
      this.oneshotSource = source;
    }).finally(() => {
      this.oneshotSource = null;
    });
  }

  private pausePendingForOneshot() {
    window.clearTimeout(this.gapTimer);
    this.stopSource(this.currentSource);
    this.currentSource = null;
  }

  private stopSource(source: AudioBufferSourceNode | null) {
    if (!source) return;
    try {
      source.onended = null;
      source.stop();
    } catch {
      // already stopped
    }
    try {
      source.disconnect();
    } catch {
      // ignore
    }
  }

  private async ensureBuffer(kind: SoundKind): Promise<AudioBuffer | null> {
    const cached = this.buffers.get(kind);
    if (cached) return cached;
    if (!this.ctx) return null;

    const res = await fetch(SOUND_FILES[kind]);
    if (!res.ok) return null;
    const raw = await res.arrayBuffer();
    const buffer = await this.ctx.decodeAudioData(raw.slice(0));
    this.buffers.set(kind, buffer);
    return buffer;
  }

  private async playBuffer(
    kind: SoundKind,
    assign?: (source: AudioBufferSourceNode) => void
  ): Promise<void> {
    if (!this.unlocked) return;
    const ctx = this.ctx;
    if (!ctx) return;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        return;
      }
    }

    const buffer = await this.ensureBuffer(kind);
    if (!buffer) return;

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = SOUND_VOLUME;
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(ctx.destination);
    assign?.(source);

    await new Promise<void>((resolve) => {
      source.onended = () => resolve();
      try {
        source.start(0);
      } catch {
        resolve();
      }
    });
  }

  private async playPendingCycle(gen: number) {
    if (!this.active || gen !== this.generation) return;
    if (Date.now() < this.mutedUntil) {
      this.gapTimer = window.setTimeout(
        () => void this.playPendingCycle(gen),
        Math.max(200, this.mutedUntil - Date.now())
      );
      return;
    }
    const kind = this.kind;
    if (!kind) {
      this.active = false;
      return;
    }

    this.stopSource(this.currentSource);
    this.currentSource = null;

    try {
      await this.playBuffer(kind, (source) => {
        this.currentSource = source;
      });
    } catch {
      // fall through to retry
    }

    if (!this.active || gen !== this.generation) return;
    this.gapTimer = window.setTimeout(() => void this.playPendingCycle(gen), PENDING_GAP_MS);
  }
}

export const adminSound = new AdminSoundController();
export const ADMIN_SOUND_POST_CLEAR_MUTE_MS = POST_CLEAR_MUTE_MS;
