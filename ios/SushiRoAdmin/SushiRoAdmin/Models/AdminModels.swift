import Foundation

struct AdminOrder: Identifiable, Decodable, Equatable {
    let id: String
    let orderNumber: Int?
    let status: String
    let pickupType: String
    let pickupTime: String?
    let cutlery: Bool?
    let cutleryQuantity: Int?
    let extraWasabi: Bool?
    let extraGinger: Bool?
    let extraSoySauce: Bool?
    let noWasabi: Bool?
    let noGinger: Bool?
    let noSoySauce: Bool?
    let specialInstructions: String?
    let allergyNotes: String?
    let subtotal: Double?
    let tax: Double?
    let total: Double?
    let statusReason: String?
    let createdAt: String
    let orderItems: [AdminOrderItem]?
    let customer: AdminCustomer?

    enum CodingKeys: String, CodingKey {
        case id
        case orderNumber = "order_number"
        case status
        case pickupType = "pickup_type"
        case pickupTime = "pickup_time"
        case cutlery
        case cutleryQuantity = "cutlery_quantity"
        case extraWasabi = "extra_wasabi"
        case extraGinger = "extra_ginger"
        case extraSoySauce = "extra_soy_sauce"
        case noWasabi = "no_wasabi"
        case noGinger = "no_ginger"
        case noSoySauce = "no_soy_sauce"
        case specialInstructions = "special_instructions"
        case allergyNotes = "allergy_notes"
        case subtotal, tax, total
        case statusReason = "status_reason"
        case createdAt = "created_at"
        case orderItems = "order_items"
        case customer
    }

    var isPending: Bool { status == "pending" }
    var isASAP: Bool { pickupType == "asap" }
    var isAccepted: Bool { status == "accepted" }

    var customerTitle: String {
        let first = AdminFormat.displayName(customer?.firstName) ?? "Guest"
        let last = AdminFormat.displayName(customer?.lastName) ?? ""
        return last.isEmpty ? first : "\(first) \(last)"
    }

    var itemCount: Int {
        (orderItems ?? []).reduce(0) { $0 + max($1.quantity, 1) }
    }

    var extras: [String] {
        var lines: [String] = []
        if cutlery == true {
            lines.append("Cutlery x\(cutleryQuantity ?? 1)")
        } else {
            lines.append("No cutlery")
        }
        if extraWasabi == true { lines.append("Extra wasabi") }
        if extraGinger == true { lines.append("Extra ginger") }
        if extraSoySauce == true { lines.append("Extra soy sauce") }
        if noWasabi == true { lines.append("No wasabi") }
        if noGinger == true { lines.append("No ginger") }
        if noSoySauce == true { lines.append("No soy sauce") }
        return lines
    }

    /// Countdown to pickup/ready time for accepted ASAP and scheduled orders.
    func countdown(now: Date) -> String? {
        guard let pickupTime, let date = ISO8601DateFormatter.parse(pickupTime) else { return nil }
        let show =
            isAccepted
            || (pickupType == "scheduled" && (isPending || isAccepted))
        guard show else { return nil }
        let diffMs = date.timeIntervalSince(now)
        guard diffMs > 0 else { return nil }
        let totalMinutes = Int(ceil(diffMs / 60))
        let hours = totalMinutes / 60
        let minutes = totalMinutes % 60
        return hours > 0 ? "\(hours)h \(minutes)m" : "\(minutes)m"
    }
}

struct AdminOrderItem: Identifiable, Decodable, Equatable {
    let id: String
    let name: String
    let quantity: Int
    let sectionSlug: String?
    let specialRequest: String?
    let selectedOptions: [AdminSelectedOption]?

    enum CodingKeys: String, CodingKey {
        case id, name, quantity
        case sectionSlug = "section_slug"
        case specialRequest = "special_request"
        case selectedOptions = "selected_options"
    }

    var isGF: Bool { sectionSlug == "gluten-free" }

    var displayName: String {
        AdminFormat.menuItemName(name)
    }

    var optionSummary: String {
        (selectedOptions ?? [])
            .map { AdminFormat.optionLabel($0.name) }
            .filter { !$0.isEmpty }
            .joined(separator: ", ")
    }
}

struct AdminSelectedOption: Decodable, Equatable {
    let id: String?
    let name: String
}

struct AdminCustomer: Decodable, Equatable {
    let id: String?
    let firstName: String?
    let lastName: String?
    let phone: String?

    enum CodingKeys: String, CodingKey {
        case id
        case firstName = "first_name"
        case lastName = "last_name"
        case phone
    }
}

struct OrdersResponse: Decodable {
    let orders: [AdminOrder]
}

struct SettingsResponse: Decodable {
    let settings: RestaurantSettingsPayload?
    let waitingTime: WaitingTimePayload?
}

struct RestaurantSettingsPayload: Decodable {
    let pauseUntil: String?
    let closingTime: String?
    let testMode: Bool?
    let soldOutItemIds: [String]?
    let specialClosedDates: [SpecialClosedDatePayload]?

    enum CodingKeys: String, CodingKey {
        case pauseUntil = "pause_until"
        case closingTime = "closing_time"
        case testMode = "test_mode"
        case soldOutItemIds = "sold_out_item_ids"
        case specialClosedDates = "special_closed_dates"
    }
}

struct WaitingTimePayload: Decodable {
    let minutes: Int?
}

/// Special closed dates may arrive as a string (legacy) or `{start,end,message}`.
enum SpecialClosedDatePayload: Decodable, Equatable {
    case day(String)
    case period(SpecialClosedPeriod)

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let day = try? container.decode(String.self) {
            self = .day(day)
            return
        }
        self = .period(try container.decode(SpecialClosedPeriod.self))
    }

    var asPeriod: SpecialClosedPeriod {
        switch self {
        case .day(let day):
            return SpecialClosedPeriod(start: day, end: day, message: nil)
        case .period(let period):
            return period
        }
    }
}

struct SpecialClosedPeriod: Codable, Equatable, Identifiable, Hashable {
    var start: String
    var end: String
    var message: String?

    var id: String { "\(start)|\(end)|\(message ?? "")" }

    var label: String {
        start == end ? start : "\(start) to \(end)"
    }
}

struct MenuResponse: Decodable {
    let sections: [MenuSection]
    let categories: [MenuCategory]
    let items: [MenuItemPayload]
}

struct MenuSection: Decodable, Identifiable, Equatable {
    let id: String
    let name: String
    let slug: String
    let sortOrder: Int?

    enum CodingKeys: String, CodingKey {
        case id, name, slug
        case sortOrder = "sort_order"
    }

    var isGF: Bool { slug == "gluten-free" }
}

struct MenuCategory: Decodable, Identifiable, Equatable {
    let id: String
    let sectionId: String
    let name: String
    let slug: String
    let sortOrder: Int?

    enum CodingKeys: String, CodingKey {
        case id, name, slug
        case sectionId = "section_id"
        case sortOrder = "sort_order"
    }
}

struct MenuItemPayload: Decodable, Identifiable, Equatable {
    let id: String
    let categoryId: String
    let name: String
    let sortOrder: Int?

    enum CodingKeys: String, CodingKey {
        case id, name
        case categoryId = "category_id"
        case sortOrder = "sort_order"
    }
}
