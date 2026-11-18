# Component and code index

Open the linked pair together. The markup establishes semantics and the script supplies state transitions. The full gallery runs offline by opening [index.html](../assets/web/index.html). A loopback server gives browser storage a consistent origin.

| Need | Code to open | Interaction contract |
| --- | --- | --- |
| Primary, quiet, disabled, icon-with-label buttons | [base.css](../assets/web/base.css), [control form](../assets/web/controls.html) | Named outcome, target, keyboard activation, pressed feedback; disable only while unavailable. |
| Adaptive navigation and skip link | [cabinet markup](../assets/web/index.html), [base.css](../assets/web/base.css) | Real links, current location, wrap at large text, programmatic focus target. |
| Search, saved scope, empty states, selectable rows | [cabinet.js](../assets/web/cabinet.js) | Preserve identifiers, combine filters, restore focus after a filtered row disappears. |
| Dialog, field notes, durable status | [cabinet markup](../assets/web/index.html), [cabinet.js](../assets/web/cabinet.js) | Modal accessible name, Escape, inert background, focus return, storage-failure feedback. |
| Select, slider, segmented units, chart, data table | [tide.html](../assets/web/tide.html), [tide.js](../assets/web/tide.js) | Use one numeric model. Format values at display time. Offer exact values without inspecting a chart. |
| Editor, font picker, range, checkbox, explicit save | [type.html](../assets/web/type.html), [type.js](../assets/web/type.js) | Draft and committed state are independent. Restore changes both the controls and the proof. |
| Radio group, switch, inline validation, progress, retry | [controls.html](../assets/web/controls.html), [controls.js](../assets/web/controls.js) | Keep a native form. Label groups and controls. Keep field choices after interruption. |
| Queue, removal and undo | [controls.js](../assets/web/controls.js) | Reinsert at former position, move focus to the restored action. Queue is an in-memory print simulation. |
| Animated disclosure, selection and sheet | [motion.html](../assets/web/motion.html), [motion.js](../assets/web/motion.js), [motion.css](../assets/web/motion.css) | Set semantic state immediately. Hidden disclosure content is inert. Reduced motion yields the same end state. |
| Searchable split view, toolbar, menu, sheet, editable form | [FieldJournalView.swift](../assets/swift/Sources/FieldKit/FieldJournalView.swift) | System selection, explicit Save, cancellation safeguards and a clear empty detail. |
| Gauge, stepper and slider | [ReadingGauge.swift](../assets/swift/Sources/FieldKit/ReadingGauge.swift) | Give precise adjustments an alternative to dragging. Keep all representations bound to the same value. |
| Persistence and identity | [Journal.swift](../assets/swift/Sources/FieldKit/Journal.swift), [desktop entry](../assets/swift/Sources/FieldDesk/main.swift) | Validate before replacement. Editing retains the ID. Unreadable data stays intact. |

## Choosing between adjacent controls

- **Toggle or button**. Use a toggle for an enduring binary setting whose label remains stable. Use a button for a command or submission. “Double-sided printing” has a value. “Queue print” has an outcome.
- **Tabs or segments**. Use tabs for peer destinations that retain context. Use segments for a small mutually exclusive scope within one view, such as units. Use radios when choices need individual descriptions.
- **Sheet or navigation**. Use navigation to explore a hierarchy. Use a sheet for a bounded task with a clear dismissal or completion. Choose an alert when interruption is warranted and a decision cannot safely wait.
- **Menu or visible action**. Keep a frequent defining action visible. Group infrequent alternatives in a menu. A context menu augments an accessible route to the same essential operation.
- **Slider or stepper**. Use a slider to explore a meaningful continuous range. Pair it with discrete controls or direct entry when precision matters.
- **List or grid**. Use a list for cross-item comparison and dense labels. Use a grid when recognition depends on imagery. Preserve readable captions at narrow widths.

For native controls outside the example set, search the bundled source index by the exact component name. Use system implementation and document the deployment target for the API you adopt. [Apple components](https://developer.apple.com/design/human-interface-guidelines/components)
