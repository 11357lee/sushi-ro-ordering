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
                    VStack(alignment: .leading, spacing: 12) {
                        if let notes = notesText {
                            Text(notes)
                                .font(.title3.weight(.semibold))
                                .foregroundStyle(.red)
                                .padding(14)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.red.opacity(0.1))
                                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                        }

                        FlexibleChipWrap(items: liveOrder.extras)

                        ForEach(sortedItems) { item in
                            itemRow(item)
                        }
                    }
                    .padding(20)
                }

                if liveOrder.isPending {
                    Divider()
                    pendingActions
                        .padding(16)
                        .background(Color(uiColor: .systemBackground))
                }
            }
            .navigationTitle(liveOrder.customerTitle)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { onClose() }
                        .frame(minHeight: 44)
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
                                .font(.subheadline.weight(.semibold))
                                .foregroundStyle(.red)
                                .padding(.horizontal, 10)
                                .padding(.vertical, 6)
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
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 6) {
                Text("\(AdminFormat.time(liveOrder.createdAt)) · \(liveOrder.status.capitalized)")
                    .font(.title3)
                    .foregroundStyle(.secondary)
                Text(AdminFormat.phoneDisplay(liveOrder.customer?.phone))
                    .font(.title3)
                if let countdown = liveOrder.countdown(now: session.now) {
                    Text(countdown)
                        .font(.headline.bold())
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(Color.orange.opacity(0.2))
                        .foregroundStyle(.orange)
                        .clipShape(Capsule())
                }
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 4) {
                Text(AdminFormat.money(liveOrder.total ?? liveOrder.subtotal))
                    .font(.title.bold())
                Text("Sub \(AdminFormat.money(liveOrder.subtotal)) · Tax \(AdminFormat.money(liveOrder.tax))")
                    .font(.body)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(16)
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
        VStack(alignment: .leading, spacing: 6) {
            HStack(alignment: .firstTextBaseline, spacing: 10) {
                (
                    Text("\(item.quantity) x \(item.displayName)")
                        .font(.title2.weight(.semibold))
                    + (
                        item.optionSummary.isEmpty
                            ? Text("")
                            : Text(" - \(item.optionSummary)")
                                .font(.title2.weight(.regular))
                                .foregroundColor(.blue)
                    )
                )
                .fixedSize(horizontal: false, vertical: true)
                Spacer(minLength: 8)
                if item.isGF {
                    Text("GF")
                        .font(.headline.bold())
                        .foregroundStyle(.white)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(AdminColors.gfBadge)
                        .clipShape(Capsule())
                }
            }
            if let special = item.specialRequest, !special.isEmpty {
                Text(special)
                    .font(.body)
                    .italic()
                    .foregroundStyle(.red)
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(item.isGF ? AdminColors.gfFill : AdminColors.regularFill)
        .overlay(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .stroke(item.isGF ? AdminColors.gfStroke : Color.clear, lineWidth: 2)
        )
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
    }

    private var pendingActions: some View {
        VStack(alignment: .leading, spacing: 12) {
            if liveOrder.isASAP {
                Text("Prep (min)")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
                LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 5), spacing: 8) {
                    ForEach(primaryPrep, id: \.self) { minutes in
                        prepButton(minutes)
                    }
                }
                LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 6), spacing: 8) {
                    ForEach(extendedPrep, id: \.self) { minutes in
                        prepButton(minutes, extended: true)
                    }
                }
                TextField("Custom min", text: $customPrepText)
                    .keyboardType(.numberPad)
                    .textFieldStyle(.roundedBorder)
                    .font(.title3)
                    .frame(minHeight: 48)
                    .onChange(of: customPrepText) { value in
                        let digits = String(value.filter(\.isNumber).prefix(3))
                        if digits != value { customPrepText = digits }
                        if let n = Int(digits), n > 0 {
                            prepMinutes = n
                        }
                    }
            }

            HStack(spacing: 12) {
                Button {
                    Task { await session.accept(liveOrder, prepMinutes: effectivePrepMinutes) }
                } label: {
                    Text("Accept")
                        .font(.headline)
                        .frame(maxWidth: .infinity, minHeight: 52)
                        .background(Color.green)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
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
                        .font(.headline)
                        .frame(maxWidth: .infinity, minHeight: 52)
                        .background(Color.red)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                }
            }

            Picker("Reject reason", selection: $rejectReason) {
                ForEach(rejectReasons, id: \.self) { Text($0).tag($0) }
            }
            .pickerStyle(.menu)
            .frame(minHeight: 44)

            if rejectReason == "Custom message" {
                TextField("Reject message", text: $customReason)
                    .textFieldStyle(.roundedBorder)
                    .frame(minHeight: 44)
            }
        }
    }

    private func prepButton(_ minutes: Int, extended: Bool = false) -> some View {
        Button {
            prepMinutes = minutes
            customPrepText = ""
        } label: {
            Text("\(minutes)")
                .font(.headline)
                .frame(maxWidth: .infinity, minHeight: 44)
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
                .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
        }
    }
}
