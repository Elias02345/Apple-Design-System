import XCTest
@testable import FieldKit

final class JournalTests: XCTestCase {
    func testEditingKeepsIdentityAndRejectsWhitespace() throws {
        var journal = Journal()
        var draft = Entry(title: "  North inlet  ", pinned: true)
        XCTAssertTrue(journal.save(draft))
        XCTAssertEqual(journal.entries.first?.title, "North inlet")
        draft.title = "West pier"
        XCTAssertTrue(journal.save(draft))
        XCTAssertEqual(journal.entries.count, 1)
        draft.title = "  "
        XCTAssertFalse(journal.save(draft))
        XCTAssertEqual(journal.entries.first?.title, "West pier")
        let stored = try JSONEncoder().encode(journal)
        XCTAssertEqual(try JSONDecoder().decode(Journal.self, from: stored), journal)
    }
    func testSearchAndPinnedFilterCompose() {
        let journal = Journal(entries: [Entry(title:"North inlet", pinned:true), Entry(title:"North pier")])
        XCTAssertEqual(journal.matching(" north ", pinnedOnly:true).map(\.title), ["North inlet"])
        XCTAssertTrue(journal.matching("Fern", pinnedOnly:false).isEmpty)
        XCTAssertEqual(journal.matching("", pinnedOnly:false).count,2)
    }
}
