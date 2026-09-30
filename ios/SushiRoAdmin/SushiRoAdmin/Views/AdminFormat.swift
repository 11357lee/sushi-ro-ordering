import SwiftUI

enum AdminFormat {
    private static let time: DateFormatter = {
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_CA")
        f.timeZone = TimeZone(identifier: "America/Toronto")
        f.dateFormat = "h:mm a"
        return f
    }()

    private static let phone: NumberFormatter = {
        let f = NumberFormatter()
        f.numberStyle = .none
        return f
    }()

    static func time(_ iso: String?) -> String {
        guard let iso, let date = ISO8601DateFormatter.parse(iso) else { return "—" }
        return time.string(from: date)
    }

    static func money(_ value: Double?) -> String {
        guard let value else { return "$0.00" }
        return String(format: "$%.2f", value)
    }

    static func phoneDisplay(_ raw: String?) -> String {
        guard let raw else { return "" }
        let digits = raw.filter(\.isNumber)
        guard digits.count == 10 else { return raw }
        let a = digits.prefix(3)
        let b = digits.dropFirst(3).prefix(3)
        let c = digits.suffix(4)
        return "(\(a)) \(b)-\(c)"
    }
}
