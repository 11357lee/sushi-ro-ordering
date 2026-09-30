import AVFoundation
import Foundation

@MainActor
final class OrderSoundPlayer {
    private var player: AVAudioPlayer?
    private var loopTimer: Timer?

    func configureSession() {
        let session = AVAudioSession.sharedInstance()
        try? session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
        try? session.setActive(true)
    }

    func playNewOrder(kind: String) {
        stop()
        let name = kind == "scheduled" ? "order-scheduled" : "order-asap"
        guard let url = Bundle.main.url(forResource: name, withExtension: "mp3"),
              let audio = try? AVAudioPlayer(contentsOf: url)
        else { return }
        audio.numberOfLoops = -1
        audio.prepareToPlay()
        audio.play()
        player = audio
    }

    func playCancel() {
        stop()
        guard let url = Bundle.main.url(forResource: "order-cancelled", withExtension: "mp3"),
              let audio = try? AVAudioPlayer(contentsOf: url)
        else { return }
        audio.numberOfLoops = 0
        audio.prepareToPlay()
        audio.play()
        player = audio
        // Play twice like the web admin
        loopTimer = Timer.scheduledTimer(withTimeInterval: 1.2, repeats: false) { [weak self] _ in
            Task { @MainActor in
                audio.currentTime = 0
                audio.play()
                self?.player = audio
            }
        }
    }

    /// Stops looping new-order alerts without interrupting a one-shot cancel chirp mid-play.
    func stopPendingLoop() {
        if let player, player.numberOfLoops == -1 {
            stop()
        }
    }

    func stop() {
        loopTimer?.invalidate()
        loopTimer = nil
        player?.stop()
        player = nil
    }
}
