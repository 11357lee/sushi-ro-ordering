import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var session: AdminSession
    @Environment(\.dismiss) private var dismiss

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

                Section {
                    Button("Stop alert sound") {
                        session.stopSound()
                    }
                    .frame(minHeight: 44)
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
        }
    }
}
