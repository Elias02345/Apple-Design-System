# Release validation

The browser suite exercises the real HTML entry points using Chromium, Firefox and WebKit. The native suite runs on macOS and builds FieldKit for an iOS Simulator destination. A second package tests the shared station model and compiles the Watch, TV and Vision views against their respective device SDKs. Automated accessibility assertions cover detectable WCAG A/AA issues in the sampled states. VoiceOver speech, real-device touch, remote focus, Crown input and headset comfort need separate hands-on evaluation.

| Observed in the working interface | Change | Regression exercise |
| --- | --- | --- |
| The station picker could not be found by its intended exact label. | Associate a separate visible label with the select. | Change station and units, then compare the range, table and saved reading. |
| At 200% type, Firefox measured a 488 px document in a 390 px RTL viewport. Grid children kept an intrinsic minimum width. | Allow tracks, fields and inputs to shrink and long headings to wrap. | Enter a long Arabic proof, switch direction, enlarge text and assert that the document fits. |
| A Windows WebKit build returned focus outside the light-table trigger after Escape. | Explicitly focus the trigger in the sheet's close event. | Open from the selection study, dismiss, and activate the focused control. |
| At 200% text, five time-axis labels widened an RTL tide view to 519 px on a 390 px viewport. | Show three ticks when space is limited. Give the plot, labels and range a consistent chronological direction. | Apply the installed inspection script to all six studies, then rerun the dedicated axis check in three engines. |
| The desktop capture clipped sidebar note titles and lacked an opaque reading surface. | Allow two-line note rows, specify a sidebar width and set the native capture's appearance and background. | Render the real SwiftUI views in a macOS test and inspect the resulting images. |

The release suite passed 69 browser cases on Windows. The packaged inspector checked 18 appearance, size and direction combinations across six studies. GitHub also exercises the browser suite on Linux, the native model and rendering tests on macOS, the iOS Simulator build and the three additional device SDKs. [Cross-browser and native run](https://github.com/Elias02345/Apple-Design-System/actions/runs/44188715901) · [Platform SDK run](https://github.com/Elias02345/Apple-Design-System/actions/runs/44191500240) · [Current checks](https://github.com/Elias02345/Apple-Design-System/actions/workflows/validate.yml)

For a feature change, start with the affected scenario in [the flow suite](../tests/flows.spec.cjs). Follow it with the adjacent cancellation, empty, retry or focus case. Capture the same viewport before and after a visual change. The [skill's inspection guide](../skills/stillform/references/inspection.md) is the procedure used when applying the system to another project.

To reproduce the web showcase from a checkout, install the package's development dependencies and Chromium, then run `node tools/capture.cjs test-results/frames`. With Python and Pillow installed, run `python tools/encode-motion.py test-results/frames`. The PNGs are real page captures. The GIF encoder samples paused browser transitions at known times and holds the endpoints for readability.
