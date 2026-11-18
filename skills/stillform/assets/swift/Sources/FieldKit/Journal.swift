import Foundation

public struct Entry: Identifiable, Codable, Equatable {
    public let id: UUID
    public var title: String
    public var pinned: Bool
    public var observation: String?
    public init(id: UUID = UUID(), title: String, pinned: Bool = false, observation: String? = nil) {
        self.id = id
        self.title = title
        self.pinned = pinned
        self.observation = observation
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
        Entry(title: "Compare the chamber walls", pinned: true, observation: "In the cut ammonite, the chambers widen toward the rim. Follow the pale seam between two neighboring chambers and compare their curvature."),
        Entry(title: "Photograph the blue crystal faces", observation: "Turn the specimen until one crystal face catches the light. Keep the dark matrix in the frame for comparison."),
        Entry(title: "Trace the fern impression", observation: "Start at the central stem. Compare the spacing of the leaflets near the base and the tip.")
    ])
}
