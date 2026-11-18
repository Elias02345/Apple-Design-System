# Decisions that survive a change of style

Apple names eight design principles. Use the principle that resolves a concrete trade-off, then test its consequence in the interface. The interpretations and checks below are Stillform's. [Apple design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles)

| Principle | Decision to make | Observable check |
| --- | --- | --- |
| Purpose | Put the user's object and next meaningful action in the first useful view. | A returning reader can reopen their item before seeing any promotion. |
| Agency | Give an escape from a transient mode and a recovery path for a reversible change. | Dismiss the sheet, revisit the item and inspect what persisted. |
| Responsibility | Ask for the smallest permission when someone first uses the relevant feature. | Denying access leaves a working alternative or a precise explanation. |
| Familiarity | Reuse system navigation, roles and shortcuts wherever their behavior fits. | Back returns one level. A toggle changes a setting. A link opens a destination. |
| Flexibility | Adapt the arrangement to input, scale and available space. | Resize mid-task. Selection, work and meaningful labels survive. |
| Simplicity | Keep frequent actions visible. Expose specialist controls at the decision they affect. | Count steps in the common task and inspect the rare task independently. |
| Craft | Resolve the states people encounter between the ideal screenshots. | Repeated taps, a late response and a long translation yield coherent results. |
| Delight | Express the character of the product at a moment that already matters. | Hide the flourish. The operation, meaning and feedback still work. |

## Compose with real content

Start on a blank surface with one real object, one real action and one difficult piece of content. Establish visual order using type scale, alignment and whitespace. Add a boundary only when it clarifies ownership, selection or interaction. Group items that share a decision. Independent rectangular cards for the name, description and date of one object usually obscure that relationship.

**Collection** — Place the image beside its identification. Use compact rows when the next task is comparison. A saved filter belongs beside search. A note belongs inside the inspected object. See [Specimen cabinet](../assets/web/index.html).

**Instrument** — Lead with the reading and unit. Show movement over time in a chart with a common scale. Put the time control against that chart. Offer exact numbers in a table. See [Tide book](../assets/web/tide.html).

**Creative tool** — Give the work the largest surface. Keep editable properties together and update the proof in place. Name when a change becomes durable. See [Type room](../assets/web/type.html).

**Operational form** — Lead with the fields needed to submit. Group the work queue separately. A retry retains the settings that made the request meaningful. See [Control bench](../assets/web/controls.html).

## Before and after

| Symptom | Replace it with | Inspect |
| --- | --- | --- |
| Three equally bright actions on each list row | Whole-row inspection, secondary actions in the detail view | Can a person still reach the secondary action with the keyboard? |
| Glass over every paragraph | An opaque reading surface. Try a material on floating navigation only if it needs separation. | Place it over the lightest and busiest content. |
| Hero badge, promotional heading and “Get started” on a returning user's dashboard | Current work, last position and a named action such as “Resume draft” | Can a returning person continue in one selection? |
| Status conveyed only by tint or pulse | State word, symbol or position plus optional color | Inspect in grayscale and with animation disabled. |
| One phone layout enlarged onto a desktop | Persistent index and detail with shared selection | Collapse to one pane while editing. |
| Repeated labels such as “Explore more” | Verb plus object or destination | Review the links or controls read out of surrounding context. |

For an expressive product, preserve a visible point of view in composition, imagery, lettering or interaction. In an emergency, transaction or dense operations tool, clarity and reliability may be its strongest expression.
