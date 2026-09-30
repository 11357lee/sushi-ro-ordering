import Combine
import Foundation
import UIKit

@MainActor
final class AdminSession: ObservableObject {
    private static let serverURLKey = "sushi-ro-admin-server-url"
    private static let rememberKeyAccount = "admin-api-key"

    @Published var serverURLString: String
    @Published var apiKey: String = ""
    @Published var rememberDevice: Bool = true
    @Published var authenticated = false
    @Published var loginError: String?
    @Published var isLoggingIn = false

    @Published var orders: [AdminOrder] = []
    @Published var waitingMinutes: Int = 15
    @Published var pauseUntil: String?
    @Published var testMode = false
    @Published var closingTime: String = "21:00:00"
    @Published var selectedOrderId: String?
    @Published var statusMessage: String?

    private var client: AdminAPIClient
    private let sound = OrderSoundPlayer()
    private var pollTask: Task<Void, Never>?
    private var knownOrderIds = Set<String>()
    private var seeded = false
    private var cancelAlerted = Set<String>()

    init() {
        let savedURL =
            UserDefaults.standard.string(forKey: Self.serverURLKey)?
            .trimmingCharacters(in: .whitespacesAndNewlines)
        let defaultURL = savedURL?.isEmpty == false
            ? savedURL!
            : "https://sushi-ro-ordering.vercel.app"
        serverURLString = defaultURL
        let url = URL(string: defaultURL) ?? URL(string: "https://sushi-ro-ordering.vercel.app")!
        client = AdminAPIClient(baseURL: url)

        if let savedKey = KeychainStore.get(account: Self.rememberKeyAccount), !savedKey.isEmpty {
            apiKey = savedKey
            rememberDevice = true
            Task { await login(usingSavedKey: true) }
        }

        sound.configureSession()
        UIApplication.shared.isIdleTimerDisabled = true
    }

    var selectedOrder: AdminOrder? {
        guard let selectedOrderId else { return nil }
        return orders.first { $0.id == selectedOrderId }
    }

    var restaurantOpen: Bool {
        if testMode { return true }
        if let pauseUntil, let until = ISO8601DateFormatter.parse(pauseUntil),
           until > Date()
        {
            return false
        }
        return true
    }

    func saveServerURL() {
        let trimmed = serverURLString.trimmingCharacters(in: .whitespacesAndNewlines)
            .trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        serverURLString = trimmed
        UserDefaults.standard.set(trimmed, forKey: Self.serverURLKey)
        if let url = URL(string: trimmed) {
            client.baseURL = url
        }
    }

    func login(usingSavedKey: Bool = false) async {
        loginError = nil
        isLoggingIn = true
        defer { isLoggingIn = false }

        saveServerURL()
        let key = apiKey.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !key.isEmpty else {
            loginError = "Enter your admin API key."
            return
        }
        guard let url = URL(string: serverURLString) else {
            loginError = "Server URL is invalid."
            return
        }

        client = AdminAPIClient(baseURL: url, apiKey: key)
        do {
            let fetched = try await client.fetchOrders()
            apiKey = key
            orders = fetched
            authenticated = true
            seeded = false
            knownOrderIds = []
            if rememberDevice {
                KeychainStore.set(key, account: Self.rememberKeyAccount)
            } else {
                KeychainStore.delete(account: Self.rememberKeyAccount)
            }
            await refreshSettings()
            startPolling()
        } catch {
            authenticated = false
            if usingSavedKey, case AdminAPIError.unauthorized = error {
                KeychainStore.delete(account: Self.rememberKeyAccount)
                apiKey = ""
            }
            loginError = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }

    func logout() {
        pollTask?.cancel()
        pollTask = nil
        sound.stop()
        authenticated = false
        orders = []
        selectedOrderId = nil
        KeychainStore.delete(account: Self.rememberKeyAccount)
        apiKey = ""
        rememberDevice = false
    }

    func startPolling() {
        pollTask?.cancel()
        pollTask = Task { [weak self] in
            while !Task.isCancelled {
                await self?.refresh()
                try? await Task.sleep(nanoseconds: 3_000_000_000)
            }
        }
    }

    func refresh() async {
        guard authenticated else { return }
        do {
            let fetched = try await client.fetchOrders()
            handleNewOrders(fetched)
            orders = fetched
            await refreshSettings()
        } catch {
            // Keep last known state during brief network blips.
        }
    }

    private func refreshSettings() async {
        do {
            let settings = try await client.fetchSettings()
            waitingMinutes = settings.waitingTime?.minutes ?? waitingMinutes
            pauseUntil = settings.settings?.pauseUntil
            testMode = settings.settings?.testMode ?? false
            closingTime = settings.settings?.closingTime ?? closingTime
        } catch {
            // ignore
        }
    }

    private func handleNewOrders(_ fetched: [AdminOrder]) {
        let ids = Set(fetched.map(\.id))
        if !seeded {
            knownOrderIds = ids
            seeded = true
            if !fetched.contains(where: \.isPending) {
                sound.stopPendingLoop()
            }
            return
        }

        let newIds = ids.subtracting(knownOrderIds)
        knownOrderIds = ids

        if !newIds.isEmpty {
            let newest = fetched.first { newIds.contains($0.id) }
            if let newest, newest.isPending, restaurantOpen {
                sound.playNewOrder(kind: newest.isASAP ? "asap" : "scheduled")
            }
        }

        for order in fetched where order.status == "cancelled" {
            if order.statusReason == "Customer cancelled online", !cancelAlerted.contains(order.id) {
                cancelAlerted.insert(order.id)
                sound.playCancel()
            }
        }

        if !fetched.contains(where: \.isPending) || !restaurantOpen {
            // Leave cancel chirp alone; stop looping pending alert when queue is clear.
            if !fetched.contains(where: \.isPending) {
                sound.stopPendingLoop()
            }
        }
    }

    func setWaitingMinutes(_ minutes: Int) async {
        guard restaurantOpen else { return }
        do {
            try await client.updateWaitingTime(minutes)
            waitingMinutes = minutes
        } catch {
            statusMessage = (error as? LocalizedError)?.errorDescription
        }
    }

    func accept(_ order: AdminOrder, prepMinutes: Int) async {
        do {
            let pickup: String?
            if order.isASAP {
                pickup = ISO8601DateFormatter.basic.string(
                    from: Date().addingTimeInterval(TimeInterval(prepMinutes * 60))
                )
            } else {
                pickup = order.pickupTime
            }
            try await client.updateOrder(
                orderId: order.id,
                status: "accepted",
                pickupTime: pickup,
                prepMinutes: order.isASAP ? prepMinutes : nil
            )
            sound.stop()
            selectedOrderId = nil
            await refresh()
        } catch {
            statusMessage = (error as? LocalizedError)?.errorDescription
        }
    }

    func reject(_ order: AdminOrder, reason: String) async {
        do {
            try await client.updateOrder(
                orderId: order.id,
                status: "rejected",
                statusReason: reason
            )
            sound.stop()
            selectedOrderId = nil
            await refresh()
        } catch {
            statusMessage = (error as? LocalizedError)?.errorDescription
        }
    }

    func cancel(_ order: AdminOrder, reason: String) async {
        do {
            try await client.updateOrder(
                orderId: order.id,
                status: "cancelled",
                statusReason: reason
            )
            selectedOrderId = nil
            await refresh()
        } catch {
            statusMessage = (error as? LocalizedError)?.errorDescription
        }
    }

    func dismissAllOrders() async {
        do {
            try await client.dismissOrders()
            sound.stop()
            await refresh()
        } catch {
            statusMessage = (error as? LocalizedError)?.errorDescription
        }
    }

    func setTestMode(_ enabled: Bool) async {
        do {
            try await client.updateTestMode(enabled)
            testMode = enabled
            statusMessage = enabled ? "Test mode on" : "Test mode off"
            await refreshSettings()
        } catch {
            statusMessage = (error as? LocalizedError)?.errorDescription
        }
    }

    func pause(_ duration: String) async {
        do {
            try await client.pauseService(duration, closingTime: closingTime)
            await refreshSettings()
        } catch {
            statusMessage = (error as? LocalizedError)?.errorDescription
        }
    }

    func stopSound() {
        sound.stop()
    }
}

extension ISO8601DateFormatter {
    static let full: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f
    }()

    static let basic: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime]
        return f
    }()

    static func parse(_ value: String) -> Date? {
        full.date(from: value) ?? basic.date(from: value)
    }
}
