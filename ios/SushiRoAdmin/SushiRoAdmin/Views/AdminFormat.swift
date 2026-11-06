import SwiftUI

enum AdminFormat {
    private static let time: DateFormatter = {
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_CA")
        f.timeZone = TimeZone(identifier: "America/Toronto")
        f.dateFormat = "h:mm a"
        return f
    }()

    private static let dayKey: DateFormatter = {
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = TimeZone(identifier: "America/Toronto")
        f.dateFormat = "yyyy-MM-dd"
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

    static func displayName(_ text: String?) -> String? {
        guard let text, !text.isEmpty else { return nil }
        return titled(text)
    }

    static func displayName(_ text: String) -> String {
        titled(text)
    }

    private static func titled(_ text: String) -> String {
        text
            .split(whereSeparator: \.isWhitespace)
            .map { word -> String in
                let value = String(word)
                if value.contains("'") {
                    let parts = value.split(separator: "'", omittingEmptySubsequences: false)
                    return parts.enumerated().map { index, part in
                        let p = String(part)
                        guard !p.isEmpty else { return p }
                        if index == 0 {
                            return p.prefix(1).uppercased() + p.dropFirst().lowercased()
                        }
                        return p.lowercased()
                    }.joined(separator: "'")
                }
                guard let first = value.first else { return value }
                return String(first).uppercased() + value.dropFirst().lowercased()
            }
            .joined(separator: " ")
    }

    /// Capitalized item title with redundant (GF) removed — GF shows as a badge.
    static func menuItemName(_ text: String) -> String {
        displayName(text)
            .replacingOccurrences(
                of: #"\s*\(\s*gf\s*\)"#,
                with: "",
                options: [.regularExpression, .caseInsensitive]
            )
            .replacingOccurrences(of: #"\s{2,}"#, with: " ", options: .regularExpression)
            .trimmingCharacters(in: .whitespaces)
    }

    static func optionLabel(_ text: String) -> String {
        var short = text.split(whereSeparator: { "—–".contains($0) }).first.map(String.init) ?? text
        if let dash = short.range(of: " - ") {
            short = String(short[..<dash.lowerBound])
        }
        short = short.replacingOccurrences(
            of: #"\s*\([^)]*\)\s*"#,
            with: " ",
            options: .regularExpression
        )
        // Match web toAdminOptionLabel: drop "with …" tails (cutlet sauces, etc.)
        if let range = short.range(of: #"\s+with\s+.+$"#, options: [.regularExpression, .caseInsensitive]) {
            short.removeSubrange(range)
        }
        return displayName(short.trimmingCharacters(in: .whitespaces))
    }

    private static let bentoMeatNames: Set<String> = [
        "Chicken Teriyaki",
        "Beef Teriyaki",
        "Salmon Teriyaki",
        "Shrimp Teriyaki",
        "Chicken cutlet with spicy sauce",
        "Pork cutlet with spicy sauce",
        "Fish Cutlet with spicy sauce",
        "Unagi",
        "Grilled Mackerel",
    ]

    private static let bentoSideNames: Set<String> = [
        "Maki (3 California and 3 BBQ Salmon)",
        "Tempura (3 vegetables and 1 Shrimp)",
        "Vegetable Gyoza",
        "Vegetable Spring Roll",
        "Maki (6 cucumber-avocado)",
        "Vegetable Tempura",
    ]

    /// Bento Box + Chicken cutlet + Maki → ("Chicken Cutlet Bento Box", "Maki")
    static func orderItemParts(name: String, options: [AdminSelectedOption]) -> (title: String, optionSummary: String) {
        let normalized = name.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()

        if normalized == "bento box" {
            let meat = options.first { bentoMeatNames.contains($0.name) }
            let side = options.first { bentoSideNames.contains($0.name) }
            let rest = options.filter { $0.name != meat?.name && $0.name != side?.name }
            let meatLabel = meat.map { optionLabel($0.name) } ?? ""
            let title = meatLabel.isEmpty ? menuItemName(name) : "\(meatLabel) Bento Box"
            let summary = ([side].compactMap { $0 } + rest)
                .map { optionLabel($0.name) }
                .filter { !$0.isEmpty }
                .joined(separator: ", ")
            return (title, summary)
        }

        if normalized.contains("veggie bento") {
            let side = options.first { bentoSideNames.contains($0.name) }
            let rest = options.filter { $0.name != side?.name }
            let summary = ([side].compactMap { $0 } + rest)
                .map { optionLabel($0.name) }
                .filter { !$0.isEmpty }
                .joined(separator: ", ")
            return (menuItemName(name), summary)
        }

        let summary = options
            .map { optionLabel($0.name) }
            .filter { !$0.isEmpty }
            .joined(separator: ", ")
        return (menuItemName(name), summary)
    }

    static func dayString(_ date: Date) -> String {
        dayKey.string(from: date)
    }

    static func parseDay(_ value: String) -> Date? {
        dayKey.date(from: value)
    }
}

enum AdminColors {
    /// Strong violet so GF rows read clearly on iPad (not grey-ish).
    static let gfFill = Color(red: 0.42, green: 0.12, blue: 0.78).opacity(0.22)
    static let gfStroke = Color(red: 0.40, green: 0.08, blue: 0.72)
    static let gfBadge = Color(red: 0.38, green: 0.05, blue: 0.68)
    static let regularFill = Color(uiColor: .secondarySystemBackground)
}
