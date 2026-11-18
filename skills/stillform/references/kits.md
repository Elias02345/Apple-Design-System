# Working with editable kits

Use a current kit when a brief depends on a specific platform variant, state, control size, or icon relationship. Obtain the kit from Apple’s resource directory. Sketch’s document menu contains **Download**. Figma’s **Open in Figma** action can require an account. Record the platform, kit version and document title alongside the observation. [Apple Design Resources](https://developer.apple.com/design/resources/)

Run the inspector from the skill folder with a locally supplied Sketch document. All processing stays on the machine. The first command finds matching artboards or symbol masters. The second reads the matching layer records and includes their bounds and immediate children.

```sh
python scripts/sketch.py "/path/to/Apple iOS 27 UI Kit.sketch" buttons light disabled --limit 4
python scripts/sketch.py "/path/to/Apple iOS 27 UI Kit.sketch" buttons light disabled --measure --limit 2
```

A result includes the page, variant name, page ID and layer ID. Search a short term first. Use the returned names to narrow to the particular role, control size, appearance and state. A zero-match query exits with code 1. A file error exits with code 2. Documents with no indexed artboards can still contain ordinary layers visible in Sketch.

**Example decision.** A compact inspector needs a destructive button. Identify its state in the kit, inspect its bounds and label arrangement, and choose the matching semantic role in the host toolkit. A layer frame measures the artwork in this one document. Establish its actual interaction area with the running control. Exercise keyboard activation, disabled behavior, long translations and increased text size. Record which measurements came from the kit and which behaviors came from the running app. [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) · [Inspection loop](inspection.md)

For a comparison, run the same search against two kit versions and compare like-for-like variants. Keep the source document in the project’s approved research location. Carry the decision and the reference identifier into the implementation review. [Source guide](sources.md)
