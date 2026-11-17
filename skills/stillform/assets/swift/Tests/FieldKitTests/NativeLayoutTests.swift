#if os(macOS)
import AppKit
import SwiftUI
import XCTest
@testable import FieldKit

final class NativeLayoutTests: XCTestCase {
    @MainActor func testJournalAndGaugeRenderAtDesktopSizes() throws {
        _ = NSApplication.shared
        try capture(FieldJournalView(), name: "field-journal", size: NSSize(width: 880, height: 520))
        try capture(ReadingGauge(), name: "reading-gauge", size: NSSize(width: 360, height: 240))
    }

    @MainActor private func capture<Content: View>(_ content: Content, name: String, size: NSSize) throws {
        let host = NSHostingView(rootView: content.background(Color(nsColor: .windowBackgroundColor)).environment(\.colorScheme, .light))
        let window = NSWindow(contentRect: NSRect(origin: .zero, size: size),
                              styleMask: [.titled, .resizable], backing: .buffered, defer: false)
        window.contentView = host
        window.appearance = NSAppearance(named: .aqua)
        window.title = "Field journal"
        window.makeKeyAndOrderFront(nil)
        defer { window.orderOut(nil) }
        host.frame.size = size
        host.layoutSubtreeIfNeeded()
        window.displayIfNeeded()
        RunLoop.main.run(until: Date().addingTimeInterval(0.25))
        let bitmap = try XCTUnwrap(host.bitmapImageRepForCachingDisplay(in: host.bounds))
        host.cacheDisplay(in: host.bounds, to: bitmap)
        let png = try XCTUnwrap(bitmap.representation(using: .png, properties: [:]))
        XCTAssertGreaterThan(png.count, 2500)
        if let directory = ProcessInfo.processInfo.environment["STILLFORM_NATIVE_CAPTURES"] {
            let folder = URL(fileURLWithPath: directory, isDirectory: true)
            try FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
            try png.write(to: folder.appendingPathComponent(name + ".png"))
        }
    }
}
#endif
