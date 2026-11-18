import SwiftUI
import FieldKit

@main struct FieldDesk: App {
    @AppStorage("stillform.fielddesk.v1") private var saved = Data()
    private var restored: Journal? { try? JSONDecoder().decode(Journal.self, from: saved) }
    var body: some Scene {
        WindowGroup {
            if saved.isEmpty || restored != nil {
                FieldJournalView(journal: restored ?? .sample) { journal in
                    if let encoded = try? JSONEncoder().encode(journal) { saved = encoded }
                }
            } else {
                ContentUnavailableView("Saved notes could not be read", systemImage: "exclamationmark.triangle",
                    description: Text("Your saved data has been retained."))
            }
        }
    }
}
