/**
 * Single pending-order alert controller.
 * Idempotent start (won't restart if already running) and hard stop on accept.
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

type PendingKind = "asap" | "scheduled";

class AdminSoundController {
  private pendingAudio: HTMLAudioElement | null = null;
  private oneshotAudio: HTMLAudioElement | null = null;
  private gapTimer = 0;
  private muteTimer = 0;
  private generation = 0;
  private active = false;
  private kind: PendingKind | null = null;
  private mutedUntil = 0;

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
    this.playPendingCycle(gen);
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
    this.tearDownPendingAudio();
  }

  /** Stop everything (logout / leave admin). */
  stopAll() {
    this.stopPending();
    this.mutedUntil = 0;
    if (this.oneshotAudio) {
      this.oneshotAudio.pause();
      this.oneshotAudio.onended = null;
      this.oneshotAudio = null;
    }
  }

  playCancelTwice() {
    const shouldResume = this.active && this.kind !== null;
    this.pausePendingForOneshot();

    const playOne = () => {
      const audio = new Audio(SOUND_FILES["customer-cancelled"]);
      audio.volume = SOUND_VOLUME;
      this.oneshotAudio = audio;
      return audio;
    };

    const finish = () => {
      this.oneshotAudio = null;
      if (shouldResume && this.kind && Date.now() >= this.mutedUntil) {
        this.active = false;
        this.startPending();
      }
    };

    const playSecond = () => {
      const second = playOne();
      second.onended = finish;
      void second.play().catch(finish);
    };

    const first = playOne();
    first.onended = () => {
      window.setTimeout(playSecond, 250);
    };
    void first.play().catch(() => {
      window.setTimeout(playSecond, 700);
    });
  }

  playTest(kind: PendingKind | "customer-cancelled") {
    if (kind === "customer-cancelled") {
      this.playCancelTwice();
      return;
    }
    this.pausePendingForOneshot();
    const audio = new Audio(SOUND_FILES[kind]);
    audio.volume = SOUND_VOLUME;
    this.oneshotAudio = audio;
    audio.onended = () => {
      this.oneshotAudio = null;
    };
    void audio.play().catch(() => {});
  }

  private pausePendingForOneshot() {
    window.clearTimeout(this.gapTimer);
    this.tearDownPendingAudio();
  }

  private tearDownPendingAudio() {
    if (!this.pendingAudio) return;
    this.pendingAudio.onended = null;
    try {
      this.pendingAudio.pause();
      this.pendingAudio.currentTime = 0;
    } catch {
      // ignore
    }
    this.pendingAudio = null;
  }

  private playPendingCycle(gen: number) {
    if (!this.active || gen !== this.generation) return;
    if (Date.now() < this.mutedUntil) {
      this.gapTimer = window.setTimeout(
        () => this.playPendingCycle(gen),
        Math.max(200, this.mutedUntil - Date.now())
      );
      return;
    }
    const kind = this.kind;
    if (!kind) {
      this.active = false;
      return;
    }

    this.tearDownPendingAudio();
    const audio = new Audio(SOUND_FILES[kind]);
    audio.volume = SOUND_VOLUME;
    this.pendingAudio = audio;

    let settled = false;
    const afterClip = () => {
      if (settled || !this.active || gen !== this.generation) return;
      settled = true;
      this.gapTimer = window.setTimeout(() => this.playPendingCycle(gen), PENDING_GAP_MS);
    };

    audio.onended = afterClip;
    void audio.play().then(undefined, () => {
      if (!this.active || gen !== this.generation) return;
      this.gapTimer = window.setTimeout(() => this.playPendingCycle(gen), 5000);
    });
  }
}

export const adminSound = new AdminSoundController();
export const ADMIN_SOUND_POST_CLEAR_MUTE_MS = POST_CLEAR_MUTE_MS;
