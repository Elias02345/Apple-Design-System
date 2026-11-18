# Release validation

The browser suite exercises the real HTML entry points using Chromium, Firefox and WebKit. The native suite runs on macOS and builds FieldKit for an iOS Simulator destination. Automated accessibility assertions cover detectable WCAG A/AA issues in the sampled states. VoiceOver speech, real-device touch, remote focus, Crown input and headset comfort need separate hands-on evaluation.

| Observed in the working interface | Change | Regression exercise |
| --- | --- | --- |
| The station picker could not be found by its intended exact label. | Associate a separate visible label with the select. | Change station and units, then compare the range, table and saved reading. |
| At 200% type, Firefox measured a 488 px document in a 390 px RTL viewport. Grid children kept an intrinsic minimum width. | Allow tracks, fields and inputs to shrink and long headings to wrap. | Enter a long Arabic proof, switch direction, enlarge text and assert that the document fits. |
| A Windows WebKit build returned focus outside the light-table trigger after Escape. | Explicitly focus the trigger in the sheet's close event. | Open from the selection study, dismiss, and activate the focused control. |
| The desktop capture clipped sidebar note titles and lacked an opaque reading surface. | Allow two-line note rows, specify a sidebar width and set the native capture's appearance and background. | Render the real SwiftUI views in a macOS test and inspect the resulting images. |

The isolated browser run passed 66 cases on Windows. GitHub independently ran the browser suite on Linux, the native tests on macOS, and the iOS Simulator build. Source-routing checks also run in CI. [Cross-browser and native run](https://github.com/Elias02345/Apple-Design-System/actions/runs/44188715901) · [Current checks](https://github.com/Elias02345/Apple-Design-System/actions/workflows/validate.yml)

For a feature change, start with the affected scenario in [the flow suite](../tests/flows.spec.cjs). Follow it with the adjacent cancellation, empty, retry or focus case. Capture the same viewport before and after a visual change. The [skill's inspection guide](../skills/stillform/references/inspection.md) is the procedure used when applying the system to another project.
