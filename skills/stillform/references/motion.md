# Motion that explains a change

Identify the changing relationship first. Selection moves along a short track because exactly one choice is active. A sheet enters above its parent because the task is temporary. A disclosure expands where its trigger sits because the added material belongs to that row. Updating a numeric reading continuously while someone drags gives immediate feedback without a second animation. [Apple motion guidance](https://developer.apple.com/design/human-interface-guidelines/motion)

| Pattern | Implementation | Interruption | Reduced motion |
| --- | --- | --- | --- |
| Button press | [base.css](../assets/web/base.css) moves an enabled control by 1 px on activation | Releasing restores the resting style | No translation |
| Segmented selection | [motion.css](../assets/web/motion.css) moves one shared indicator; [motion.js](../assets/web/motion.js) updates the selected value | Rapid toggles retarget the CSS transition; logical direction follows RTL | Instant selection, same selected label |
| Disclosure | A CSS grid row transitions between 0fr and 1fr. The inner wrapper clips during the transition. | The current size retargets on a second activation. Expanded state and inertness update immediately. | Final height changes immediately |
| Sheet entry | [cabinet](../assets/web/index.html) opens a native dialog with an accessible title and an entry transition | Escape or Close dismisses even during entry. Focus returns to a meaningful origin. | Immediate presentation |
| Optical comparison | [light table](../assets/web/motion.html) transitions only the inspected image's color treatment | The label always names the selected lighting option | Instant image change |
| Value reset | [ReadingGauge.swift](../assets/swift/Sources/FieldKit/ReadingGauge.swift) changes a single bound value | Manual input can take over | Environment setting selects a nil animation |

The starter's 120 ms feedback and 240 ms entry tokens are web defaults. Tune them to distance, input and task frequency. Keep a busy button usable to assistive technology, preserve its label or announce its replacement, and prevent duplicate work. A loading animation represents outstanding work. When an estimate is unavailable, use a system indeterminate indicator and express progress in words.

## Acceptance sequence

Activate, reverse immediately, activate again, then interrupt by leaving the view. Verify the final semantic state, focus and data after each event. Repeat with reduced motion enabled before opening the page, then toggle it while the page is open. If the transition carries essential meaning, add a persistent word, position or state to express the same information. For native screens, respect the environment's motion setting and use system transitions wherever they fit.
