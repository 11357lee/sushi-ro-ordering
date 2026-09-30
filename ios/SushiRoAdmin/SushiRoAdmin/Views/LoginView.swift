import SwiftUI

struct LoginView: View {
    @EnvironmentObject private var session: AdminSession
    @State private var showKey = false

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Text("Sushi-Ro Admin")
                        .font(.largeTitle.bold())
                        .listRowBackground(Color.clear)
                    Text("Native iPad kitchen board — not Safari. Uses the same Admin API as the website.")
                        .foregroundStyle(.secondary)
                        .listRowBackground(Color.clear)
                }

                Section("Server") {
                    TextField("https://your-app.vercel.app", text: $session.serverURLString)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        .keyboardType(.URL)
                }

                Section("Admin key") {
                    Group {
                        if showKey {
                            TextField("Admin API key", text: $session.apiKey)
                        } else {
                            SecureField("Admin API key", text: $session.apiKey)
                        }
                    }
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()

                    Toggle("Show key", isOn: $showKey)
                    Toggle("Remember this iPad", isOn: $session.rememberDevice)
                }

                if let loginError = session.loginError {
                    Section {
                        Text(loginError)
                            .foregroundStyle(.red)
                    }
                }

                Section {
                    Button {
                        Task { await session.login() }
                    } label: {
                        HStack {
                            Spacer()
                            if session.isLoggingIn {
                                ProgressView()
                            } else {
                                Text("Enter").font(.headline)
                            }
                            Spacer()
                        }
                        .frame(minHeight: 44)
                    }
                    .disabled(session.isLoggingIn)
                }
            }
            .navigationTitle("Kitchen App")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
