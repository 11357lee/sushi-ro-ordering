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

    var customerTitle: String {
        let first = customer?.firstName?.capitalized ?? "Guest"
        let last = customer?.lastName?.capitalized ?? ""
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

    var optionSummary: String {
        (selectedOptions ?? [])
            .map(\.name)
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

    enum CodingKeys: String, CodingKey {
        case pauseUntil = "pause_until"
        case closingTime = "closing_time"
        case testMode = "test_mode"
        case soldOutItemIds = "sold_out_item_ids"
    }
}

struct WaitingTimePayload: Decodable {
    let minutes: Int?
}
