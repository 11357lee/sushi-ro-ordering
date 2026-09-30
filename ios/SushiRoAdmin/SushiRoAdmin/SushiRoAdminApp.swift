import SwiftUI

@main
struct SushiRoAdminApp: App {
    @StateObject private var session = AdminSession()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(session)
                .preferredColorScheme(.light)
        }
    }
}
