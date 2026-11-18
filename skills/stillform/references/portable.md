# Apply Stillform across platforms

Start with the host project’s navigation, text scale, input model and accessibility settings. Translate the interaction contract into that toolkit. Preserving a draft is a shared requirement. Choosing the dialog, Back action, focus destination and keyboard shortcut depends on the host.

## Find working code

From the installed skill folder, list the patterns available for a stack, inspect their dependencies, or print a complete source unit with its imports. The index names the component to extract and a behavior to verify.

```sh
python scripts/snippet.py flutter
python scripts/snippet.py flutter precision --json
python scripts/snippet.py dioxus draft-editor --code
python scripts/snippet.py web async-action
python scripts/snippet.py swiftui precision
```

| Surface | Working source | Reuse it |
| --- | --- | --- |
| Web | [Six studies](../assets/web/index.html) | Combine semantic elements, [CSS tokens](../assets/web/tokens.css) and [DOM primitives](../assets/web/primitives.js). Within a framework, bind the helper after mount and call its cleanup method when that component unmounts. |
| Flutter | [Listening desk and reading proof](../assets/flutter/lib/main.dart) | Embed [controlled widgets](../assets/flutter/lib/controls.dart), a [precision field](../assets/flutter/lib/reading_proof.dart) or the [draft editor](../assets/flutter/lib/cue_desk.dart). Provide a host Material theme and a commit callback. |
| Rust with Dioxus | [Web and desktop entry](../assets/dioxus/src/main.rs) | Embed [components](../assets/dioxus/src/lib.rs) or reuse the [state model](../assets/dioxus/src/model.rs) separately. The [proof controls](../assets/dioxus/src/proof.rs) share their [stylesheet](../assets/dioxus/src/style.css) across renderers. |
| SwiftUI | [Field journal](../assets/swift/Sources/FieldKit/FieldJournalView.swift) | Supply the application model and persistence callback. Watch, TV and Vision have [device-specific input studies](platforms.md). |

## Embed in Flutter

In `assets/flutter`, run `flutter pub get`, `flutter test` and `flutter run -d chrome`. This standalone runner includes a web target. An existing Android, iOS or desktop Flutter project can depend on the package by path.

```yaml
dependencies:
  stillform_cues:
    path: vendor/stillform/flutter
```

```dart
import 'package:stillform_cues/cue.dart';
import 'package:stillform_cues/cue_desk.dart';

CueDesk sessionEditor(List<Cue> cues, Future<void> Function(Cue) writeCue) =>
    CueDesk(initialCues: cues, durationSeconds: 120, onCommit: writeCue);
```

The editor seeds a local draft from the supplied records. Use a new key when opening a different session. The demo saves in session memory. In a host, complete the future when the actual write succeeds, and throw on failure to leave the draft available for retry. The list and detail stack as text grows. The reading proof provides step buttons alongside a slider and restores both settings on Undo. [Widget tests](../assets/flutter/test/editor_test.dart) · [Flutter adaptive design](https://docs.flutter.dev/ui/adaptive-responsive/best-practices)

## Embed in Dioxus

In `assets/dioxus`, run `cargo test --locked --test editor`. With the Dioxus 0.7 CLI and the WebAssembly target installed, run `dx serve --platform web`. With desktop prerequisites installed, run `cargo run --locked --features desktop`. In an existing app, depend on the library by path and enable the renderer in the host application.

```toml
[dependencies]
stillform-cues = { path = "vendor/stillform/dioxus" }
```

The [entry point](../assets/dioxus/src/main.rs) shows the full component invocation. Include `STYLE` once. The save callback returns `SaveFuture` with `Ok(())` after a successful write or an actionable message in `Err`. Scope the theme to the consuming surface. The two destinations retain their state independently. [State tests](../assets/dioxus/tests/editor.rs) · [Dioxus 0.7](https://docs.rs/dioxus/0.7.3/dioxus/)

## Port a pattern to another toolkit

For Compose, Qt, React Native or another host, identify the committed object ID, draft, pending destination and focus destination. Use the host’s normal state lifetime, accessible field, action, focus API and layout system. Verify the following through its real entry point.

1. Edit A and attempt to open B. Keep editing and type again in A’s field.
2. Attempt a blank save. The field identifies the correction and committed A stays intact.
3. Fail one write, retry, and complete it. A remains selected, its ID survives, and a second activation during the write cannot save twice.
4. Resize the window, increase text, reverse direction where supported, and exercise the primary input device.

For a chart, compare the visual reading with an accessible exact value. For navigation, test focus and scroll position on return. For animation, reverse direction during a transition and repeat with reduced motion. Record the runtime and device exercised. [Interaction contracts](contracts.json) · [Inspection loop](inspection.md)
