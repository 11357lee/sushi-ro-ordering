import SwiftUI

struct OrdersBoardView: View {
    @EnvironmentObject private var session: AdminSession
    @State private var showSettings = false

    private let waitingOptions = [15, 30, 60, 120]

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                waitingBar
                Divider()
                if session.orders.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "tray")
                            .font(.system(size: 44))
                            .foregroundStyle(.secondary)
                        Text("No orders on screen")
                            .font(.title3.weight(.semibold))
                        Text("New pickup orders will appear here.")
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    ScrollView {
                        LazyVGrid(
                            columns: [
                                GridItem(.adaptive(minimum: 340, maximum: 560), spacing: 16)
                            ],
                            spacing: 16
                        ) {
                            ForEach(session.orders) { order in
                                OrderCardView(order: order) {
                                    session.selectedOrderId = order.id
                                }
                            }
                        }
                        .padding(16)
                    }
                }
            }
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("Sushi-Ro Orders")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    if session.testMode {
                        Text("TEST MODE")
                            .font(.caption.bold())
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.orange.opacity(0.25))
                            .clipShape(Capsule())
                    }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Menu {
                        Button("Settings") { showSettings = true }
                        Button("Clear orders") {
                            Task { await session.dismissAllOrders() }
                        }
                        Button("Stop sound") { session.stopSound() }
                        Divider()
                        Button("Logout", role: .destructive) { session.logout() }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                            .font(.title3)
                            .frame(minWidth: 44, minHeight: 44)
                    }
                }
            }
            .sheet(isPresented: $showSettings) {
                SettingsView()
            }
            .sheet(item: Binding(
                get: { session.selectedOrder },
                set: { session.selectedOrderId = $0?.id }
            )) { order in
                OrderDetailView(order: order)
            }
        }
    }

    private var waitingBar: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Waiting")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.secondary)
            HStack(spacing: 10) {
                ForEach(waitingOptions, id: \.self) { minutes in
                    Button {
                        Task { await session.setWaitingMinutes(minutes) }
                    } label: {
                        Text(label(for: minutes))
                            .font(.headline)
                            .frame(minWidth: 72, minHeight: 44)
                            .padding(.horizontal, 8)
                            .background(background(for: minutes))
                            .foregroundStyle(foreground(for: minutes))
                            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                    }
                    .disabled(!session.restaurantOpen)
                }
                Spacer(minLength: 0)
            }
            if !session.restaurantOpen {
                Text("Waiting controls disabled while closed or paused.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(.ultraThinMaterial)
    }

    private func label(for minutes: Int) -> String {
        switch minutes {
        case 15: return "15m"
        case 30: return "30m"
        case 60: return "1h"
        case 120: return "2h"
        default: return "\(minutes)m"
        }
    }

    private func background(for minutes: Int) -> Color {
        guard session.waitingMinutes == minutes else {
            return Color(uiColor: .secondarySystemBackground)
        }
        switch minutes {
        case 15: return .green
        case 30: return .orange
        default: return .red
        }
    }

    private func foreground(for minutes: Int) -> Color {
        session.waitingMinutes == minutes ? .white : .primary
    }
}

struct OrderCardView: View {
    let order: AdminOrder
    let onOpen: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if order.status == "missed" {
                badge("Missed — not accepted in 4 minutes", color: .orange)
            }
            if order.status == "cancelled", order.statusReason == "Customer cancelled online" {
                badge("Customer cancelled online", color: .red)
            }
            if order.isPending, !order.isASAP {
                badge("Scheduled — accept when ready", color: .cyan)
            }

            Text(order.customerTitle)
                .font(.title2.bold())
            Text(AdminFormat.time(order.createdAt))
                .foregroundStyle(.secondary)
            Text("\(AdminFormat.phoneDisplay(order.customer?.phone)) · \(order.status.capitalized)")
                .font(.body)

            if order.isASAP {
                Text("ASAP pickup")
                    .font(.headline)
                    .foregroundStyle(.orange)
            } else {
                Text("Pickup \(AdminFormat.time(order.pickupTime))")
                    .font(.headline)
                    .foregroundStyle(.blue)
            }

            FlowChips(items: order.extras)

            HStack {
                Button(action: onOpen) {
                    Text(
                        order.isPending
                            ? "Review & accept (\(order.itemCount))"
                            : "View menu (\(order.itemCount))"
                    )
                    .font(.headline)
                    .frame(minHeight: 44)
                    .padding(.horizontal, 14)
                    .background(Color.teal.opacity(0.15))
                    .foregroundStyle(Color.teal)
                    .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                }
                Spacer()
                VStack(alignment: .trailing) {
                    Text(AdminFormat.money(order.total ?? order.subtotal))
                        .font(.title2.bold())
                    Text("Tax \(AdminFormat.money(order.tax))")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(uiColor: .systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .stroke(borderColor, lineWidth: 2)
        )
    }

    private var borderColor: Color {
        if order.status == "cancelled" || order.status == "rejected" || order.status == "missed" {
            return .red
        }
        if order.isPending { return .orange }
        return Color(uiColor: .separator)
    }

    private func badge(_ text: String, color: Color) -> some View {
        Text(text)
            .font(.caption.bold())
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color.opacity(0.15))
            .foregroundStyle(color)
            .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
    }
}

struct FlowChips: View {
    let items: [String]

    var body: some View {
        FlexibleChipWrap(items: items)
    }
}

/// Simple wrapping chip row for iPad.
struct FlexibleChipWrap: View {
    let items: [String]

    var body: some View {
        // Adaptive grid keeps chips readable without a custom layout engine.
        LazyVGrid(
            columns: [GridItem(.adaptive(minimum: 110), spacing: 8, alignment: .leading)],
            alignment: .leading,
            spacing: 8
        ) {
            ForEach(items, id: \.self) { item in
                Text(item)
                    .font(.subheadline.weight(.medium))
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color.blue.opacity(0.12))
                    .foregroundStyle(Color.blue)
                    .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
            }
        }
    }
}
