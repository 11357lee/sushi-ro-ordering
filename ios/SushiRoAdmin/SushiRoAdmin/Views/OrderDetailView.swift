import SwiftUI

struct OrderDetailView: View {
    @EnvironmentObject private var session: AdminSession
    @Environment(\.dismiss) private var dismiss

    let order: AdminOrder

    @State private var prepMinutes: Int
    @State private var rejectReason = "Out of items"
    @State private var customReason = ""
    @State private var cancelReason = "Customer cancellation"

    private let primaryPrep = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
    private let extendedPrep = [60, 70, 80, 90, 100, 120]
    private let rejectReasons = ["Out of items", "Restaurant too busy", "Custom message"]
    private let cancelReasons = ["Customer cancellation", "Out of items", "Custom message"]

    init(order: AdminOrder) {
        self.order = order
        _prepMinutes = State(initialValue: 15)
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                header
                Divider()
                ScrollView {
                    VStack(alignment: .leading, spacing: 14) {
                        if let notes = notesText {
                            Text(notes)
                                .font(.body.weight(.semibold))
                                .foregroundStyle(.red)
                                .padding(12)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.red.opacity(0.1))
                                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                        }

                        FlexibleChipWrap(items: order.extras)

                        ForEach(order.orderItems ?? []) { item in
                            VStack(alignment: .leading, spacing: 4) {
                                HStack(alignment: .firstTextBaseline) {
                                    Text("\(item.quantity) x \(item.name)")
                                        .font(.title3.weight(.medium))
                                    if item.isGF {
                                        Text("GF")
                                            .font(.subheadline)
                                            .foregroundStyle(.purple)
                                    }
                                }
                                if !item.optionSummary.isEmpty {
                                    Text(item.optionSummary)
                                        .foregroundStyle(.blue)
                                }
                                if let special = item.specialRequest, !special.isEmpty {
                                    Text(special)
                                        .italic()
                                        .foregroundStyle(.red)
                                }
                            }
                            .padding(10)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(item.isGF ? Color.purple.opacity(0.08) : Color(uiColor: .secondarySystemBackground))
                            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                        }
                    }
                    .padding(16)
                }

                if order.isPending {
                    Divider()
                    pendingActions
                        .padding(16)
                        .background(Color(uiColor: .systemBackground))
                } else if order.status == "accepted" {
                    Divider()
                    cancelActions
                        .padding(16)
                        .background(Color(uiColor: .systemBackground))
                }
            }
            .navigationTitle(order.customerTitle)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { dismiss() }
                        .frame(minHeight: 44)
                }
            }
            .onAppear {
                prepMinutes = session.waitingMinutes
            }
        }
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
    }

    private var header: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 4) {
                Text("\(AdminFormat.time(order.createdAt)) · \(order.status.capitalized)")
                    .foregroundStyle(.secondary)
                Text(AdminFormat.phoneDisplay(order.customer?.phone))
            }
            Spacer()
            VStack(alignment: .trailing) {
                Text(AdminFormat.money(order.total ?? order.subtotal))
                    .font(.title3.bold())
                Text("Sub \(AdminFormat.money(order.subtotal)) · Tax \(AdminFormat.money(order.tax))")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(16)
    }

    private var notesText: String? {
        let parts = [order.allergyNotes, order.specialInstructions].compactMap { value -> String? in
            guard let value, !value.isEmpty else { return nil }
            return value
        }
        return parts.isEmpty ? nil : parts.joined(separator: " · ")
    }

    private var pendingActions: some View {
        VStack(alignment: .leading, spacing: 12) {
            if order.isASAP {
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
            }

            HStack(spacing: 12) {
                Button {
                    Task { await session.accept(order, prepMinutes: prepMinutes) }
                } label: {
                    Text("Accept")
                        .font(.headline)
                        .frame(maxWidth: .infinity, minHeight: 48)
                        .background(Color.green)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                }
                Button {
                    Task {
                        let reason = rejectReason == "Custom message"
                            ? (customReason.isEmpty ? "Custom message" : customReason)
                            : rejectReason
                        await session.reject(order, reason: reason)
                    }
                } label: {
                    Text("Reject")
                        .font(.headline)
                        .frame(maxWidth: .infinity, minHeight: 48)
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

    private var cancelActions: some View {
        VStack(alignment: .leading, spacing: 12) {
            Picker("Cancel reason", selection: $cancelReason) {
                ForEach(cancelReasons, id: \.self) { Text($0).tag($0) }
            }
            .pickerStyle(.menu)
            .frame(minHeight: 44)

            if cancelReason == "Custom message" {
                TextField("Cancel message", text: $customReason)
                    .textFieldStyle(.roundedBorder)
                    .frame(minHeight: 44)
            }

            Button(role: .destructive) {
                Task {
                    let reason = cancelReason == "Custom message"
                        ? (customReason.isEmpty ? "Custom message" : customReason)
                        : cancelReason
                    await session.cancel(order, reason: reason)
                }
            } label: {
                Text("Cancel order")
                    .font(.headline)
                    .frame(maxWidth: .infinity, minHeight: 48)
            }
            .buttonStyle(.borderedProminent)
            .tint(.red)
        }
    }

    private func prepButton(_ minutes: Int, extended: Bool = false) -> some View {
        Button {
            prepMinutes = minutes
        } label: {
            Text("\(minutes)")
                .font(.headline)
                .frame(maxWidth: .infinity, minHeight: 44)
                .background(
                    prepMinutes == minutes
                        ? Color.primary
                        : (extended ? Color.orange.opacity(0.2) : Color(uiColor: .secondarySystemBackground))
                )
                .foregroundStyle(prepMinutes == minutes ? Color(uiColor: .systemBackground) : .primary)
                .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
        }
    }
}
