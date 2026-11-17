# Translate the task across platforms

Keep the underlying object, intent and outcome the same. Change the arrangement, interaction and density with the platform. The journal package targets macOS 14+ and iOS/iPadOS 17+. A separate [SurfaceKit package](../assets/apple-surfaces/Package.swift) implements three views of the same illustrative station model.

| Platform | Arrangement and input | Acceptance exercise |
| --- | --- | --- |
| iPhone | Use stack navigation for depth. Keep a short edit in a sheet. Respect the safe area and keyboard. Allow long labels to wrap. | With the keyboard visible, reach error and Save. Back out of detail, preserving the list. [iOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-ios) |
| iPad | Use selectable sidebar and detail where they fit. Collapse to the same route when the window narrows. Support hardware keyboard and pointer. | Resize while selected, rotate while a sheet is open, and inspect both keyboard and touch routes. [iPadOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-ipados) |
| Mac | Use resizable windows, keyboard shortcuts and menus. Keep selection distinct from keyboard focus. Respect familiar editing commands. | Run the task using only the keyboard. Tab between regions, test a small window, verify the menu command and toolbar action agree. [macOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-macos) |
| Watch | Lead with the glanceable value. Put the next short action in reach. Use the Digital Crown for supported scrolling and adjustment. | Check largest supported text, wrist-down behavior where relevant, and whether the key value is identifiable at a glance. [watchOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-watchos) |
| TV | Determine focus paths before laying out the grid. Use legible distance typography, generous separation and a predictable initial focus. | Reach every action by remote and return to the same item after opening detail. [tvOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-tvos) |
| Vision | Begin in a window for a conventional task. Size and separate gaze targets, keep content comfortable and give controls a predictable depth. | Verify focus acquisition, alternatives to gestures and comfort on hardware. [visionOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-visionos) |
| Adaptive web | Use semantic HTML, logical layout, pointer and keyboard input, media preferences and native form controls. | Run [inspection](inspection.md) in compact/wide, light/dark and reduced-motion modes. |

## Native integration

Use [FieldJournalView](../assets/swift/Sources/FieldKit/FieldJournalView.swift) as an iOS/iPadOS or macOS root view. Supply a decoded Journal and persistence closure to integrate it into an app. The included desktop executable demonstrates that entry point. From the Swift package folder, run `swift test` and `swift run FieldDesk` on a Mac. For iOS, import the FieldKit library product into an app and present FieldJournalView. Keep host persistence, localization, deployment target and document ownership explicit.

The desktop sample models a single journal in user defaults for small demonstration records. Use a document or database and appropriate conflict handling for multiwindow production editing. The web print queue simulates a printer locally; production jobs need a real acknowledgement, durable ID and retry semantics.

For widgets, Live Activities, CarPlay, complications, immersive experiences and other system surfaces, retrieve the dedicated topic before choosing a layout. Relevant search examples include `python scripts/lookup.py complications` and `python scripts/lookup.py "live activities"`. Review on the target device or simulator before claiming support.

## Views for host apps

- In a watchOS 10+ host, present [WristReading](../assets/apple-surfaces/Sources/SurfaceKit/WristReading.swift). The Crown and two visible buttons change one bounded hour value.
- In a tvOS 17+ host, present [StationShelf](../assets/apple-surfaces/Sources/SurfaceKit/StationShelf.swift). A focused station becomes selected only when the remote activates it. The selected indicator persists after focus moves elsewhere.
- In a visionOS 1+ host, present [SpatialReading](../assets/apple-surfaces/Sources/SurfaceKit/SpatialReading.swift) in a WindowGroup. A system picker and stepper make the task possible within one ordinary window.
