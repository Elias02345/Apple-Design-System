import XCTest
@testable import SurfaceKit

final class StationTests: XCTestCase {
    func testInputBoundsAndStationIdentity() {
        XCTAssertEqual(Station.northInlet.height(at: -1), Station.northInlet.height(at: 0))
        XCTAssertEqual(Station.westPier.height(at: 28), Station.westPier.height(at: 23))
        XCTAssertNotEqual(Station.westPier.height(at: 8), Station.northInlet.height(at: 8))
        XCTAssertFalse(Station.eastMarsh.reading(at: 8).isEmpty)
    }
}
