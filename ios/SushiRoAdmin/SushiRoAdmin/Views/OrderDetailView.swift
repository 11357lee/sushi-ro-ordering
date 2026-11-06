import SwiftUI

struct OrderDetailView: View {
    @EnvironmentObject private var session: AdminSession

    let order: AdminOrder
    var onClose: () -> Void = {}

    @State private var prepMinutes: Int
    @State private var customPrepText = ""
    @State private var rejectReason = "Out of items"
    @State private var customReason = ""
    @State private var cancelReason = "Customer cancellation"

    private let primaryPrep = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
    private let extendedPrep = [60, 70, 80, 90, 100, 120]
    private let rejectReasons = ["Out of items", "Restaurant too busy", "Custom message"]
    private let cancelReasons = ["Customer cancellation", "Out of items", "Custom message"]

    init(order: AdminOrder, onClose: @escaping () -> Void = {}) {
        self.order = order
        self.onClose = onClose
        _prepMinutes = State(initialValue: 15)
    }

    private var liveOrder: AdminOrder {
        session.orders.first(where: { $0.id == order.id }) ?? order
    }

    private var effectivePrepMinutes: Int {
        if let custom = Int(customPrepText), custom > 0 {
            return custom
        }
        return max(1, prepMinutes)
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                header
                Divider()
                ScrollView {
                    VStack(alignment: .leading, spacing: 10) {
                        if let notes = notesText {
                            Text(notes)
                                .font(.body.weight(.semibold))
                                .foregroundStyle(.red)
                                .padding(10)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.red.opacity(0.1))
                                .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                        }

                        FlexibleChipWrap(items: liveOrder.extras)

                        ForEach(sortedItems) { item in
                            itemRow(item)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                }

                if liveOrder.isPending {
                    Divider()
                    pendingActions
                        .padding(.horizontal, 12)
                        .padding(.top, 8)
                        .padding(.bottom, 10)
                        .background(Color(uiColor: .systemBackground))
                }
            }
            .navigationTitle("")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { onClose() }
                        .font(.subheadline.weight(.semibold))
                }
                ToolbarItem(placement: .topBarTrailing) {
                    if liveOrder.isAccepted {
                        Menu {
                            Picker("Cancel reason", selection: $cancelReason) {
                                ForEach(cancelReasons, id: \.self) { Text($0).tag($0) }
                            }
                            if cancelReason == "Custom message" {
                                TextField("Cancel message", text: $customReason)
                            }
                            Button("Cancel order", role: .destructive) {
                                Task {
                                    let reason = cancelReason == "Custom message"
                                        ? (customReason.isEmpty ? "Custom message" : customReason)
                                        : cancelReason
                                    await session.cancel(liveOrder, reason: reason)
                                    onClose()
                                }
                            }
                        } label: {
                            Text("Cancel")
                                .font(.caption.weight(.semibold))
                                .foregroundStyle(.red)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.red.opacity(0.12))
                                .clipShape(Capsule())
                        }
                    }
                }
            }
            .onAppear {
                prepMinutes = session.waitingMinutes
                customPrepText = ""
            }
        }
    }

    private var sortedItems: [AdminOrderItem] {
        let items = liveOrder.orderItems ?? []
        return items.sorted { lhs, rhs in
            if lhs.isGF != rhs.isGF { return !lhs.isGF && rhs.isGF }
            return lhs.name < rhs.name
        }
    }

    private var header: some View {
        HStack(alignment: .top, spacing: 12) {
            VStack(alignment: .leading, spacing: 3) {
                Text(liveOrder.customerTitle)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.primary)
                    .lineLimit(1)
                Text("\(AdminFormat.time(liveOrder.createdAt)) · \(liveOrder.status.capitalized) · \(AdminFormat.phoneDisplay(liveOrder.customer?.phone))")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
                if let countdown = liveOrder.countdown(now: session.now) {
                    Text(countdown)
                        .font(.caption.bold())
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(Color.orange.opacity(0.2))
                        .foregroundStyle(.orange)
                        .clipShape(Capsule())
                }
            }
            Spacer(minLength: 8)
            VStack(alignment: .trailing, spacing: 2) {
                Text(AdminFormat.money(liveOrder.total ?? liveOrder.subtotal))
                    .font(.headline.bold())
                Text("Sub \(AdminFormat.money(liveOrder.subtotal)) · Tax \(AdminFormat.money(liveOrder.tax))")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 8)
        .background(Color(uiColor: .systemBackground))
    }

    private var notesText: String? {
        let parts = [liveOrder.allergyNotes, liveOrder.specialInstructions].compactMap { value -> String? in
            guard let value, !value.isEmpty else { return nil }
            return value
        }
        return parts.isEmpty ? nil : parts.joined(separator: " · ")
    }

    private func itemRow(_ item: AdminOrderItem) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(alignment: .firstTextBaseline, spacing: 8) {
                (
                    Text("\(item.quantity)x \(item.displayName)")
                        .font(.title3.weight(.semibold))
                    + (
                        item.optionSummary.isEmpty
                            ? Text("")
                            : Text(" - \(item.optionSummary)")
                                .font(.title3.weight(.regular))
                                .foregroundColor(.blue)
                    )
                )
                .fixedSize(horizontal: false, vertical: true)
                Spacer(minLength: 8)
                if item.isGF {
                    Text("GF")
                        .font(.subheadline.bold())
                        .foregroundStyle(.white)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(AdminColors.gfBadge)
                        .clipShape(Capsule())
                }
            }
            if let special = item.specialRequest, !special.isEmpty {
                Text(special)
                    .font(.subheadline)
                    .italic()
                    .foregroundStyle(.red)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(item.isGF ? AdminColors.gfFill : AdminColors.regularFill)
        .overlay(
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .stroke(item.isGF ? AdminColors.gfStroke : Color.clear, lineWidth: 2)
        )
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }

    private var pendingActions: some View {
        VStack(alignment: .leading, spacing: 6) {
            if liveOrder.isASAP {
                Text("Prep (min)")
                    .font(.caption2.weight(.semibold))
                    .foregroundStyle(.secondary)
                LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 5), count: 5), spacing: 5) {
                    ForEach(primaryPrep, id: \.self) { minutes in
                        prepButton(minutes)
                    }
                }
                LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 5), count: 6), spacing: 5) {
                    ForEach(extendedPrep, id: \.self) { minutes in
                        prepButton(minutes, extended: true)
                    }
                }
                TextField("Custom min", text: $customPrepText)
                    .keyboardType(.numberPad)
                    .textFieldStyle(.roundedBorder)
                    .font(.subheadline)
                    .frame(minHeight: 34)
                    .onChange(of: customPrepText) { value in
                        let digits = String(value.filter(\.isNumber).prefix(3))
                        if digits != value { customPrepText = digits }
                        if let n = Int(digits), n > 0 {
                            prepMinutes = n
                        }
                    }
            }

            HStack(spacing: 10) {
                Button {
                    Task { await session.accept(liveOrder, prepMinutes: effectivePrepMinutes) }
                } label: {
                    Text("Accept")
                        .font(.subheadline.weight(.bold))
                        .frame(maxWidth: .infinity, minHeight: 40)
                        .background(Color.green)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                }
                Button {
                    Task {
                        let reason = rejectReason == "Custom message"
                            ? (customReason.isEmpty ? "Custom message" : customReason)
                            : rejectReason
                        await session.reject(liveOrder, reason: reason)
                    }
                } label: {
                    Text("Reject")
                        .font(.subheadline.weight(.bold))
                        .frame(maxWidth: .infinity, minHeight: 40)
                        .background(Color.red)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                }
            }

            Picker("Reject reason", selection: $rejectReason) {
                ForEach(rejectReasons, id: \.self) { Text($0).tag($0) }
            }
            .pickerStyle(.menu)
            .font(.caption)
            .frame(minHeight: 32)

            if rejectReason == "Custom message" {
                TextField("Reject message", text: $customReason)
                    .textFieldStyle(.roundedBorder)
                    .font(.subheadline)
                    .frame(minHeight: 34)
            }
        }
    }

    private func prepButton(_ minutes: Int, extended: Bool = false) -> some View {
        Button {
            prepMinutes = minutes
            customPrepText = ""
        } label: {
            Text("\(minutes)")
                .font(.subheadline.weight(.semibold))
                .frame(maxWidth: .infinity, minHeight: 32)
                .background(
                    customPrepText.isEmpty && prepMinutes == minutes
                        ? Color.primary
                        : (extended ? Color.orange.opacity(0.2) : Color(uiColor: .secondarySystemBackground))
                )
                .foregroundStyle(
                    customPrepText.isEmpty && prepMinutes == minutes
                        ? Color(uiColor: .systemBackground)
                        : .primary
                )
                .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
        }
    }
}
