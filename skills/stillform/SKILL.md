---
name: stillform
description: Design, implement, critique, and test product interfaces using Apple Human Interface Guidelines, platform conventions, runnable web controls, and SwiftUI examples. Use for interaction design, adaptive layouts, navigation, form recovery, motion, accessibility, and interface refinement.
---

# Stillform

Start with one sentence describing the person, the object they act on, and the result they need. For an existing product, perform that task through its normal entry point before changing it. Preserve its information architecture, brand and platform conventions unless the brief or a demonstrated usability problem calls for a change.

## Choose the right material

| Decision | Open |
| --- | --- |
| What belongs on this screen? How should it feel? | [Design decisions](references/decisions.md) |
| Navigation, search, editing, permissions, latency, undo | [Flow contracts](references/flows.md) |
| Spacing, type, color, surfaces, imagery, RTL, density | [Foundations](references/foundations.md) and [semantic web tokens](assets/web/tokens.css) |
| Choose a control and obtain working code | [Component index](references/components.md) |
| Choose motion and its reduced-motion behavior | [Motion](references/motion.md) and [runnable studies](assets/web/motion.html) |
| Build for iPhone, iPad, Mac, Watch, TV or Vision | [Platform translation](references/platforms.md) |
| Find Apple's guidance, videos and linked media | [Source guide](references/sources.md) or `python scripts/lookup.py "sheets"` from this skill directory |
| Verify an implementation or critique an existing flow | [Inspection loop](references/inspection.md) and [practice briefs](references/briefs.md) |

## Design and build

1. Write the task, its entry point, completion signal and recovery path. Identify the longest plausible label, empty dataset and slow or unavailable dependency. When a native control already supplies the semantics, start with it.
2. Sketch two arrangements when hierarchy is uncertain. Name what the person sees first and the prerequisite for using the main action. Choose with realistic content. A control bench, gallery or device frame is a reference composition, never a prescribed product shell.
3. Choose one authored visual decision tied to the content. A specimen benefits from close inspection of its surface. A tide instrument earns its chart from the relationship between time and height. A writing tool earns whitespace by preserving measure. Explain how the chosen decision improves this product.
4. Open the closest executable example. Carry over its behavior contract, labels, focus handling, storage lifetime and failure behavior as appropriate. Map visual roles to the host project's tokens. Keep the component's ordinary input, keyboard and assistive-technology paths intact.
5. Implement through the real entry point. A visible action must produce its named result. Draft input survives failed submission. An essential gesture has a visible alternative. Announce asynchronous outcomes, return focus after transient UI, and respect reduced-motion and text settings.
6. Run the inspection loop. Record an observed defect, change its cause and repeat the affected scenario. Report what was exercised, the environments used and any remaining manual checks. End when the task contracts pass and remaining limits are understood.

Apple's published principles guide judgment. Stillform's CSS values, timings, copy, artwork and acceptance defaults are original implementation decisions. For a platform-specific number, exception or new API, look up the relevant platform topic before claiming it as a requirement.
