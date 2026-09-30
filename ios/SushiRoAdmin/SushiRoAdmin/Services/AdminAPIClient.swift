import Foundation

enum AdminAPIError: LocalizedError {
    case invalidURL
    case unauthorized
    case server(String)
    case network(Error)

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Server URL is invalid."
        case .unauthorized:
            return "Incorrect admin key."
        case .server(let message):
            return message
        case .network:
            return "Cannot reach the server. Check Wi-Fi and the server URL."
        }
    }
}

final class AdminAPIClient {
    var baseURL: URL
    var apiKey: String

    init(baseURL: URL, apiKey: String = "") {
        self.baseURL = baseURL
        self.apiKey = apiKey
    }

    private func request(
        path: String,
        method: String = "GET",
        body: [String: Any]? = nil,
        requiresAuth: Bool = true
    ) async throws -> Data {
        guard let url = URL(string: path, relativeTo: baseURL)?.absoluteURL else {
            throw AdminAPIError.invalidURL
        }
        var req = URLRequest(url: url)
        req.httpMethod = method
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.timeoutInterval = 20
        if requiresAuth {
            req.setValue(apiKey, forHTTPHeaderField: "x-admin-key")
        }
        if let body {
            req.httpBody = try JSONSerialization.data(withJSONObject: body)
        }

        do {
            let (data, response) = try await URLSession.shared.data(for: req)
            guard let http = response as? HTTPURLResponse else {
                throw AdminAPIError.server("Bad response")
            }
            if http.statusCode == 401 {
                throw AdminAPIError.unauthorized
            }
            if !(200...299).contains(http.statusCode) {
                let message =
                    (try? JSONDecoder().decode([String: String].self, from: data))?["error"]
                    ?? "Request failed (\(http.statusCode))"
                throw AdminAPIError.server(message)
            }
            return data
        } catch let error as AdminAPIError {
            throw error
        } catch {
            throw AdminAPIError.network(error)
        }
    }

    func fetchOrders() async throws -> [AdminOrder] {
        let data = try await request(path: "/api/admin")
        let decoded = try JSONDecoder().decode(OrdersResponse.self, from: data)
        return decoded.orders.sorted {
            ($0.createdAt) > ($1.createdAt)
        }
    }

    func fetchSettings() async throws -> SettingsResponse {
        let data = try await request(path: "/api/settings", requiresAuth: false)
        return try JSONDecoder().decode(SettingsResponse.self, from: data)
    }

    func fetchMenu() async throws -> MenuResponse {
        let data = try await request(path: "/api/menu", requiresAuth: false)
        return try JSONDecoder().decode(MenuResponse.self, from: data)
    }

    func updateWaitingTime(_ minutes: Int) async throws {
        _ = try await request(
            path: "/api/admin",
            method: "PATCH",
            body: ["action": "update_waiting_time", "waitingMinutes": minutes]
        )
    }

    func updateOrder(
        orderId: String,
        status: String,
        pickupTime: String? = nil,
        statusReason: String? = nil,
        prepMinutes: Int? = nil
    ) async throws {
        var body: [String: Any] = [
            "action": "update_order",
            "orderId": orderId,
            "status": status,
        ]
        if let pickupTime { body["pickupTime"] = pickupTime }
        if let statusReason { body["statusReason"] = statusReason }
        if let prepMinutes { body["prepMinutes"] = prepMinutes }
        _ = try await request(path: "/api/admin", method: "PATCH", body: body)
    }

    func dismissOrders() async throws {
        _ = try await request(
            path: "/api/admin",
            method: "PATCH",
            body: ["action": "dismiss_orders"]
        )
    }

    func pauseService(_ duration: String, closingTime: String) async throws {
        _ = try await request(
            path: "/api/admin",
            method: "PATCH",
            body: [
                "action": "pause_service",
                "pauseDuration": duration,
                "closingTime": closingTime,
            ]
        )
    }

    func updateTestMode(_ enabled: Bool) async throws {
        _ = try await request(
            path: "/api/admin",
            method: "PATCH",
            body: ["action": "update_test_mode", "testMode": enabled]
        )
    }

    func updateSoldOut(_ ids: [String]) async throws {
        _ = try await request(
            path: "/api/admin",
            method: "PATCH",
            body: ["action": "update_sold_out", "soldOutItemIds": ids]
        )
    }

    func updateSpecialClosedDates(_ periods: [SpecialClosedPeriod]) async throws {
        let payload: [[String: Any]] = periods.map { period in
            var entry: [String: Any] = [
                "start": period.start,
                "end": period.end,
            ]
            if let message = period.message, !message.isEmpty {
                entry["message"] = message
            }
            return entry
        }
        _ = try await request(
            path: "/api/admin",
            method: "PATCH",
            body: ["action": "update_special_closed_dates", "specialClosedDates": payload]
        )
    }
}
