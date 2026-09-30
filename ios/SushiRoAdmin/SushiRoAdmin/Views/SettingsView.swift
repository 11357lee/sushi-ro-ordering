import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var session: AdminSession
    @Environment(\.dismiss) private var dismiss

    @State private var closedStart = Date()
    @State private var closedEnd = Date()
    @State private var closedMessage = ""
    @State private var expandedCategoryId: String?

    var body: some View {
        NavigationStack {
            Form {
                Section("Server") {
                    Text(session.serverURLString)
                        .foregroundStyle(.secondary)
                    Text("Change the server URL on the login screen after logout.")
                        .font(.footnote)
                }

                Section("Test mode") {
                    Text("Turn on after hours to place and accept test orders.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                    Button {
                        Task { await session.setTestMode(!session.testMode) }
                    } label: {
                        Text(session.testMode ? "Turn off test mode" : "Turn on test mode")
                            .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
                    }
                }

                Section("Pause service") {
                    Text("Temporarily stop new customer orders.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                    ForEach(
                        [
                            ("rest_of_day", "Rest of day"),
                            ("30", "30 mins"),
                            ("60", "1 hour"),
                            ("120", "2 hours"),
                            ("clear", "Resume service"),
                        ],
                        id: \.0
                    ) { value, label in
                        Button {
                            Task { await session.pause(value) }
                        } label: {
                            Text(label)
                                .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
                        }
                    }
                }

                Section("Special closed dates") {
                    Text("Add a start and end date (same day = one day closed).")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                    DatePicker("Start", selection: $closedStart, displayedComponents: .date)
                        .frame(minHeight: 44)
                    DatePicker("End", selection: $closedEnd, displayedComponents: .date)
                        .frame(minHeight: 44)
                    TextField("Banner message (optional)", text: $closedMessage)
                        .frame(minHeight: 44)
                    Button {
                        Task {
                            await session.addSpecialClosed(
                                start: closedStart,
                                end: max(closedEnd, closedStart),
                                message: closedMessage
                            )
                            closedMessage = ""
                        }
                    } label: {
                        Text("Add closed period")
                            .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
                    }

                    if session.specialClosedPeriods.isEmpty {
                        Text("No special closed dates.")
                            .foregroundStyle(.secondary)
                    } else {
                        ForEach(session.specialClosedPeriods) { period in
                            Button(role: .destructive) {
                                Task { await session.removeSpecialClosed(period) }
                            } label: {
                                HStack {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(period.label)
                                        if let message = period.message, !message.isEmpty {
                                            Text(message)
                                                .font(.footnote)
                                                .foregroundStyle(.secondary)
                                        }
                                    }
                                    Spacer()
                                    Text("Remove")
                                        .font(.subheadline.weight(.semibold))
                                }
                                .frame(minHeight: 44)
                            }
                        }
                    }
                }

                Section {
                    Text("Mark items unavailable on the customer menu.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                } header: {
                    Text("Sold out items")
                }

                if session.menuGroups().isEmpty {
                    Section {
                        Text("Loading menu…")
                            .foregroundStyle(.secondary)
                    }
                } else {
                    Section {
                        ForEach(session.menuGroups().filter { !$0.section.isGF }, id: \.category.id) { group in
                            soldOutCategory(group)
                        }
                    } header: {
                        Text("Regular menu")
                    }

                    Section {
                        ForEach(session.menuGroups().filter(\.section.isGF), id: \.category.id) { group in
                            soldOutCategory(group)
                        }
                    } header: {
                        Text("Gluten free")
                    }
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                        .frame(minHeight: 44)
                }
            }
            .task {
                await session.ensureMenuLoaded()
            }
        }
    }

    @ViewBuilder
    private func soldOutCategory(
        _ group: (section: MenuSection, category: MenuCategory, items: [MenuItemPayload])
    ) -> some View {
        DisclosureGroup(
            isExpanded: Binding(
                get: { expandedCategoryId == group.category.id },
                set: { expandedCategoryId = $0 ? group.category.id : nil }
            )
        ) {
            FlowSoldOutItems(
                items: group.items,
                soldOutIds: session.soldOutIds,
                isGF: group.section.isGF
            ) { itemId in
                Task { await session.toggleSoldOut(itemId) }
            }
        } label: {
            HStack {
                Text(AdminFormat.displayName(group.category.name))
                    .font(.headline)
                    .foregroundStyle(group.section.isGF ? AdminColors.gfBadge : .primary)
                Spacer()
                let sold = group.items.filter { session.soldOutIds.contains($0.id) }.count
                Text(sold > 0 ? "\(sold) sold out" : "\(group.items.count) items")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            .frame(minHeight: 44)
        }
    }
}

private struct FlowSoldOutItems: View {
    let items: [MenuItemPayload]
    let soldOutIds: [String]
    let isGF: Bool
    let onToggle: (String) -> Void

    var body: some View {
        LazyVGrid(
            columns: [GridItem(.adaptive(minimum: 140), spacing: 8, alignment: .leading)],
            alignment: .leading,
            spacing: 8
        ) {
            ForEach(items) { item in
                let soldOut = soldOutIds.contains(item.id)
                Button {
                    onToggle(item.id)
                } label: {
                    Text(
                        AdminFormat.menuItemName(item.name)
                            + (soldOut ? " · Sold out" : "")
                    )
                    .font(.subheadline.weight(.medium))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 10)
                    .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
                    .background(chipBackground(soldOut: soldOut))
                    .foregroundStyle(chipForeground(soldOut: soldOut))
                    .overlay(
                        RoundedRectangle(cornerRadius: 10, style: .continuous)
                            .stroke(chipStroke(soldOut: soldOut), lineWidth: 1.5)
                    )
                    .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.vertical, 6)
    }

    private func chipBackground(soldOut: Bool) -> Color {
        if soldOut {
            return isGF ? AdminColors.gfFill : Color.red.opacity(0.15)
        }
        return isGF ? Color.blue.opacity(0.1) : Color(uiColor: .secondarySystemBackground)
    }

    private func chipForeground(soldOut: Bool) -> Color {
        if soldOut {
            return isGF ? AdminColors.gfBadge : .red
        }
        return isGF ? .blue : .primary
    }

    private func chipStroke(soldOut: Bool) -> Color {
        if soldOut {
            return isGF ? AdminColors.gfStroke : Color.red.opacity(0.5)
        }
        return isGF ? Color.blue.opacity(0.35) : Color.clear
    }
}
