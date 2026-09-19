/**
 * Admin order-alert sound for Safari/iPad.
 *
 * iOS only allows audio after a user gesture, and creating a new Audio() later
 * often fails silently. We unlock reusable elements on tap and keep a near-silent
 * keepalive so later plays (and gaps between alerts) still work.
 */

const SOUND_FILES = {
  asap: "/sounds/order-asap.mp3",
  scheduled: "/sounds/order-scheduled.mp3",
  "customer-cancelled": "/sounds/order-cancelled.mp3",
} as const;

/** Tiny silent WAV — keeps the iOS audio session awake between alerts. */
const SILENT_WAV =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

const SOUND_VOLUME = 0.85;
const PENDING_GAP_MS = 5000;
const POST_CLEAR_MUTE_MS = 10000;

type PendingKind = "asap" | "scheduled";
type SoundKind = PendingKind | "customer-cancelled";

class AdminSoundController {
  private elements: Partial<Record<SoundKind, HTMLAudioElement>> = {};
  private keepalive: HTMLAudioElement | null = null;
  private unlocked = false;
  private gapTimer = 0;
  private muteTimer = 0;
  private generation = 0;
  private active = false;
  private kind: PendingKind | null = null;
  private mutedUntil = 0;
  private playingKind: SoundKind | null = null;

  isUnlocked() {
    return this.unlocked;
  }

  /** Call from a user gesture (login / “enable sounds” tap). */
  async unlock(): Promise<boolean> {
    try {
      this.ensureElements();
      // Prime each clip under the gesture so later .play() calls are allowed.
      for (const kind of Object.keys(SOUND_FILES) as SoundKind[]) {
        const el = this.elements[kind];
        if (!el) continue;
        el.muted = true;
        el.volume = 0;
        try {
          await el.play();
        } catch {
          // ignore per-clip failure; try the rest
        }
        el.pause();
        el.currentTime = 0;
        el.muted = false;
        el.volume = SOUND_VOLUME;
      }
      await this.startKeepalive();
      this.unlocked = true;
      return true;
    } catch {
      this.unlocked = false;
      return false;
    }
  }

  setKind(kind: PendingKind | null) {
    this.kind = kind;
  }

  startPending() {
    if (this.active) return;
    if (!this.kind) return;
    if (!this.unlocked) return;
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
    this.stopPlayingPending();
  }

  stopAll() {
    this.stopPending();
    this.mutedUntil = 0;
    this.stopKeepalive();
    this.unlocked = false;
  }

  /** Resume keepalive when the iPad tab becomes visible again. */
  resumeIfNeeded() {
    if (!this.unlocked) return;
    void this.startKeepalive();
    if (this.active && this.kind && !this.playingKind) {
      const gen = this.generation;
      void this.playPendingCycle(gen);
    }
  }

  playCancelTwice() {
    if (!this.unlocked) return;
    const shouldResume = this.active && this.kind !== null;
    this.pausePendingForOneshot();

    const finish = () => {
      this.playingKind = null;
      if (shouldResume && this.kind && Date.now() >= this.mutedUntil) {
        this.active = false;
        this.startPending();
      }
    };

    const playSecond = () => {
      void this.playOneShot("customer-cancelled").then(finish, finish);
    };

    void this.playOneShot("customer-cancelled").then(
      () => window.setTimeout(playSecond, 250),
      () => window.setTimeout(playSecond, 700)
    );
  }

  playTest(kind: SoundKind) {
    if (kind === "customer-cancelled") {
      this.playCancelTwice();
      return;
    }
    this.pausePendingForOneshot();
    void this.playOneShot(kind).finally(() => {
      this.playingKind = null;
    });
  }

  private ensureElements() {
    for (const kind of Object.keys(SOUND_FILES) as SoundKind[]) {
      if (this.elements[kind]) continue;
      const el = new Audio(SOUND_FILES[kind]);
      el.preload = "auto";
      el.setAttribute("playsinline", "true");
      el.setAttribute("webkit-playsinline", "true");
      el.volume = SOUND_VOLUME;
      this.elements[kind] = el;
    }
    if (!this.keepalive) {
      const keep = new Audio(SILENT_WAV);
      keep.loop = true;
      keep.volume = 0.01;
      keep.setAttribute("playsinline", "true");
      keep.setAttribute("webkit-playsinline", "true");
      this.keepalive = keep;
    }
  }

  private async startKeepalive() {
    this.ensureElements();
    const keep = this.keepalive;
    if (!keep) return;
    try {
      keep.volume = 0.01;
      if (keep.paused) await keep.play();
    } catch {
      // Still mark unlocked if clips primed; keepalive is best-effort.
    }
  }

  private stopKeepalive() {
    if (!this.keepalive) return;
    try {
      this.keepalive.pause();
      this.keepalive.currentTime = 0;
    } catch {
      // ignore
    }
  }

  private stopPlayingPending() {
    if (!this.playingKind || this.playingKind === "customer-cancelled") {
      // Don't cut cancel mid-play from stopPending path unless generation bumped already.
    }
    for (const kind of ["asap", "scheduled"] as PendingKind[]) {
      const el = this.elements[kind];
      if (!el) continue;
      el.onended = null;
      try {
        el.pause();
        el.currentTime = 0;
      } catch {
        // ignore
      }
    }
    if (this.playingKind === "asap" || this.playingKind === "scheduled") {
      this.playingKind = null;
    }
  }

  private pausePendingForOneshot() {
    window.clearTimeout(this.gapTimer);
    this.stopPlayingPending();
  }

  private playOneShot(kind: SoundKind): Promise<void> {
    this.ensureElements();
    const el = this.elements[kind];
    if (!el) return Promise.reject(new Error("missing audio"));
    this.playingKind = kind;
    el.onended = null;
    try {
      el.pause();
      el.currentTime = 0;
    } catch {
      // ignore
    }
    el.volume = SOUND_VOLUME;
    return new Promise((resolve, reject) => {
      el.onended = () => {
        el.onended = null;
        resolve();
      };
      void el.play().then(undefined, (err) => {
        el.onended = null;
        reject(err);
      });
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

    try {
      await this.playOneShot(kind);
    } catch {
      if (!this.active || gen !== this.generation) return;
      // Retry unlock path — often means iOS suspended audio.
      void this.startKeepalive();
      this.gapTimer = window.setTimeout(() => void this.playPendingCycle(gen), 5000);
      return;
    }

    if (!this.active || gen !== this.generation) return;
    this.playingKind = null;
    this.gapTimer = window.setTimeout(() => void this.playPendingCycle(gen), PENDING_GAP_MS);
  }
}

export const adminSound = new AdminSoundController();
export const ADMIN_SOUND_POST_CLEAR_MUTE_MS = POST_CLEAR_MUTE_MS;
