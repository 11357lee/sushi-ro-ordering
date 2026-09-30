import AVFoundation
import Foundation

@MainActor
final class OrderSoundPlayer {
    private enum Mode {
        case idle
        case pending
        case cancel
    }

    private var player: AVAudioPlayer?
    private var loopTimer: Timer?
    private var mode: Mode = .idle
    /// Extra silence after each alert clip so repeats feel calmer.
    private let pendingGapSeconds: TimeInterval = 2.2
    /// Slightly slower than realtime.
    private let pendingRate: Float = 0.9

    func configureSession() {
        let session = AVAudioSession.sharedInstance()
        try? session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
        try? session.setActive(true)
    }

    func playNewOrder(kind: String) {
        stop()
        mode = .pending
        playPendingClip(kind: kind, looping: true)
    }

    func playCancel() {
        stop()
        mode = .cancel
        guard let url = Bundle.main.url(forResource: "order-cancelled", withExtension: "mp3"),
              let audio = try? AVAudioPlayer(contentsOf: url)
        else { return }
        audio.numberOfLoops = 0
        audio.enableRate = true
        audio.rate = 0.95
        audio.prepareToPlay()
        audio.play()
        player = audio
        loopTimer = Timer.scheduledTimer(withTimeInterval: 1.6, repeats: false) { [weak self] _ in
            Task { @MainActor in
                guard self?.mode == .cancel else { return }
                audio.currentTime = 0
                audio.play()
                self?.player = audio
            }
        }
    }

    /// Stops looping new-order alerts only — never cuts off a cancel chirp.
    func stopPendingLoop() {
        guard mode == .pending else { return }
        stop()
    }

    func stop() {
        loopTimer?.invalidate()
        loopTimer = nil
        player?.stop()
        player = nil
        mode = .idle
    }

    private func playPendingClip(kind: String, looping: Bool) {
        let name = kind == "scheduled" ? "order-scheduled" : "order-asap"
        guard let url = Bundle.main.url(forResource: name, withExtension: "mp3"),
              let audio = try? AVAudioPlayer(contentsOf: url)
        else { return }
        mode = .pending
        audio.numberOfLoops = 0
        audio.enableRate = true
        audio.rate = pendingRate
        audio.prepareToPlay()
        audio.play()
        player = audio

        guard looping else { return }
        let wait = (audio.duration / Double(pendingRate)) + pendingGapSeconds
        loopTimer = Timer.scheduledTimer(withTimeInterval: wait, repeats: false) { [weak self] _ in
            Task { @MainActor in
                guard self?.mode == .pending else { return }
                self?.playPendingClip(kind: kind, looping: true)
            }
        }
    }
}
