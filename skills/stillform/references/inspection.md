# Inspect → change → retest

Start with a task and a falsifiable outcome. “Close detail after removing the last saved item and focus lands on Saved” identifies an actionable defect. “The page looks premium” cannot close a test.

1. **Capture the baseline.** Open the real entry point with realistic content. Record the viewport, input, theme, text size, first visible object and available primary action. Save an image of each materially different surface. Look at those images.
2. **Walk the task.** Use normal controls to enter, complete, leave and return. Check the destination, committed data, selection, focus and an observable result. Repeat the critical path with a keyboard.
3. **Force the boundaries.** Use an empty dataset, longest plausible content, unavailable dependency, cancellation during pending work, repeated activation, dirty dismissal and reversible removal as applicable. Change appearance and width during the task.
4. **Read the interface.** Inspect the accessibility tree, names, roles, values, headings, explicit labels and reading order. Verify focus is visible and reachable. Run automated contrast, semantic and overflow checks. Then exercise the critical path with the intended screen reader and real input on supported platforms.
5. **Critique the pixels.** At small and large sizes check hierarchy, orientation, alignment, crop/focal point, clipping, reading measure, reachable actions and contrast over real content. Inspect zoom, maximum type, RTL or mixed-direction content. Inspect motion at normal speed and with reduced motion. Use actual accessibility settings where available.
6. **Repair and repeat.** Log the first reproducible failure, change its cause, rerun that case and an adjacent one, then compare captures at the same size. If two passes leave the same blocker, isolate the failing control or dependency. State what remained untested.

## Evidence template

| Task and environment | Expected | Observed / evidence | Change | Retest |
| --- | --- | --- | --- | --- |
| Saved scope, only item removed, keyboard | Return to a visible filter | Removed row no longer exists | Focus Saved after closing detail | Repeat after reload and with two records |

**Stop condition.** The chosen task completes through its real entry point, has an understandable failure/recovery path, remains usable with the required input and settings, and each discovered blocking issue has a passing retest. Keep small cosmetic preferences separate from functional failures. Report unsampled platforms explicitly.

## Tools

- For a web target, run `node scripts/inspect.cjs <url> <output-directory>` from the skill, or pass the full path to the script from a project containing Playwright. It uses Playwright and its Chromium browser. Install them in the target project's development environment if needed. Optional axe-core adds a WCAG A/AA scan. Read the report and screenshots together. The default cases exercise 320 px compact, 1280 px dark and 390 px enlarged-text RTL. The RTL pass is a stress simulation; a real localized build tests more.
- The release repository contains the interaction suite under `tests/`. From its root run `npm ci`, `npx playwright install`, then `npm test`. On Linux, `npx playwright install --with-deps` supplies browser system libraries. The skill archive can also run the examples directly from its assets directory.
- For native work run XCTest, build the app on its deployment target, use Accessibility Inspector and test with VoiceOver, keyboard or remote as applicable. Simulator build success does not establish device comfort or spoken behavior. [Accessibility Inspector](https://developer.apple.com/documentation/accessibility/accessibility-inspector)
