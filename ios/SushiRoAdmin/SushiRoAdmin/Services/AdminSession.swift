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
    @Published var soldOutIds: [String] = []
    @Published var specialClosedPeriods: [SpecialClosedPeriod] = []
    @Published var menu: MenuResponse?
    @Published var selectedOrderId: String?
    @Published var statusMessage: String?
    @Published var now = Date()

    private var client: AdminAPIClient
    private let sound = OrderSoundPlayer()
    private var pollTask: Task<Void, Never>?
    private var clockTask: Task<Void, Never>?
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
        startClock()
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
        let today = AdminFormat.dayString(Date())
        if specialClosedPeriods.contains(where: { today >= $0.start && today <= $0.end }) {
            return false
        }
        return true
    }

    func menuGroups() -> [(section: MenuSection, category: MenuCategory, items: [MenuItemPayload])] {
        guard let menu else { return [] }
        let sectionMap = Dictionary(uniqueKeysWithValues: menu.sections.map { ($0.id, $0) })
        return menu.categories
            .sorted {
                ($0.sortOrder ?? 0, $0.name) < ($1.sortOrder ?? 0, $1.name)
            }
            .compactMap { category in
                guard let section = sectionMap[category.sectionId] else { return nil }
                let items = menu.items
                    .filter { $0.categoryId == category.id }
                    .sorted { ($0.sortOrder ?? 0, $0.name) < ($1.sortOrder ?? 0, $1.name) }
                return (section, category, items)
            }
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
            await refreshMenu()
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
        menu = nil
        soldOutIds = []
        specialClosedPeriods = []
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

    private func startClock() {
        clockTask?.cancel()
        clockTask = Task { [weak self] in
            while !Task.isCancelled {
                await MainActor.run { self?.now = Date() }
                try? await Task.sleep(nanoseconds: 15_000_000_000)
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
            soldOutIds = settings.settings?.soldOutItemIds ?? []
            let today = AdminFormat.dayString(Date())
            specialClosedPeriods = (settings.settings?.specialClosedDates ?? [])
                .map(\.asPeriod)
                .filter { $0.end >= today }
                .sorted { $0.start < $1.start }
        } catch {
            // ignore
        }
    }

    private func refreshMenu() async {
        do {
            menu = try await client.fetchMenu()
        } catch {
            // ignore
        }
    }

    private func handleNewOrders(_ fetched: [AdminOrder]) {
        let ids = Set(fetched.map(\.id))
        if !seeded {
            knownOrderIds = ids
            seeded = true
            // Don't alert for cancels that were already on screen at login.
            cancelAlerted = Set(
                fetched
                    .filter { $0.status == "cancelled" && Self.isCustomerCancelled($0) }
                    .map(\.id)
            )
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

        for order in fetched where order.status == "cancelled" && Self.isCustomerCancelled(order) {
            if !cancelAlerted.contains(order.id) {
                cancelAlerted.insert(order.id)
                sound.playCancel()
            }
        }

        if !fetched.contains(where: \.isPending) {
            sound.stopPendingLoop()
        }
    }

    private static func isCustomerCancelled(_ order: AdminOrder) -> Bool {
        let reason = (order.statusReason ?? "")
            .trimmingCharacters(in: .whitespacesAndNewlines)
        return reason.caseInsensitiveCompare("Customer cancelled online") == .orderedSame
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

    func toggleSoldOut(_ itemId: String) async {
        var next = soldOutIds
        if let idx = next.firstIndex(of: itemId) {
            next.remove(at: idx)
        } else {
            next.append(itemId)
        }
        do {
            try await client.updateSoldOut(next)
            soldOutIds = next
        } catch {
            statusMessage = (error as? LocalizedError)?.errorDescription
        }
    }

    func addSpecialClosed(start: Date, end: Date, message: String) async {
        let startKey = AdminFormat.dayString(start)
        let endKey = AdminFormat.dayString(end)
        guard endKey >= startKey else {
            statusMessage = "Choose a valid start and end date."
            return
        }
        let period = SpecialClosedPeriod(
            start: startKey,
            end: endKey,
            message: message.trimmingCharacters(in: .whitespacesAndNewlines).nilIfEmpty
        )
        let today = AdminFormat.dayString(Date())
        let next = (specialClosedPeriods + [period])
            .filter { $0.end >= today }
            .sorted { $0.start < $1.start }
        do {
            try await client.updateSpecialClosedDates(next)
            specialClosedPeriods = next
            statusMessage = "Closed period saved."
        } catch {
            statusMessage = (error as? LocalizedError)?.errorDescription
        }
    }

    func removeSpecialClosed(_ period: SpecialClosedPeriod) async {
        let next = specialClosedPeriods.filter { $0 != period }
        do {
            try await client.updateSpecialClosedDates(next)
            specialClosedPeriods = next
        } catch {
            statusMessage = (error as? LocalizedError)?.errorDescription
        }
    }

    func ensureMenuLoaded() async {
        if menu == nil {
            await refreshMenu()
        }
    }
}

private extension String {
    var nilIfEmpty: String? {
        let trimmed = trimmingCharacters(in: .whitespacesAndNewlines)
        return trimmed.isEmpty ? nil : trimmed
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
