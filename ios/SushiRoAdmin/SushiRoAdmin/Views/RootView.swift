import SwiftUI

struct RootView: View {
    @EnvironmentObject private var session: AdminSession

    var body: some View {
        Group {
            if session.authenticated {
                OrdersBoardView()
            } else {
                LoginView()
            }
        }
        .alert(
            "Notice",
            isPresented: Binding(
                get: { session.statusMessage != nil },
                set: { if !$0 { session.statusMessage = nil } }
            )
        ) {
            Button("OK", role: .cancel) { session.statusMessage = nil }
        } message: {
            Text(session.statusMessage ?? "")
        }
    }
}
