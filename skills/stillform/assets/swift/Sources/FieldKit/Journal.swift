import Foundation

public struct Entry: Identifiable, Codable, Equatable {
    public let id: UUID
    public var title: String
    public var pinned: Bool
    public init(id: UUID = UUID(), title: String, pinned: Bool = false) {
        self.id = id
        self.title = title
        self.pinned = pinned
    }
}

public struct Journal: Codable, Equatable {
    public private(set) var entries: [Entry]
    public init(entries: [Entry] = []) { self.entries = entries }

    public func matching(_ query: String, pinnedOnly: Bool) -> [Entry] {
        let term = query.trimmingCharacters(in: .whitespacesAndNewlines)
        return entries.filter {
            (!pinnedOnly || $0.pinned) && (term.isEmpty || $0.title.localizedCaseInsensitiveContains(term))
        }
    }

    @discardableResult public mutating func save(_ draft: Entry) -> Bool {
        var entry = draft
        entry.title = entry.title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !entry.title.isEmpty else { return false }
        if let index = entries.firstIndex(where: { $0.id == entry.id }) {
            entries[index] = entry
        } else {
            entries.append(entry)
        }
        return true
    }

    public static let sample = Journal(entries: [
        Entry(title: "Compare the chamber walls", pinned: true),
        Entry(title: "Photograph the blue crystal faces"),
        Entry(title: "Trace the fern impression")
    ])
}
