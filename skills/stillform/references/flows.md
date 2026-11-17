# Flow contracts

| Flow | Trigger and feedback | Recovery and proof |
| --- | --- | --- |
| Browse → detail | One stable label and ID per item. Detail repeats identity and takes focus where the next decision begins. | Closing returns to the initiating row. If it disappeared, focus a useful filter or surviving row. Test removing the last saved item. |
| Search | Filter the full intended dataset. Keep the query visible, show result count after updates, distinguish zero matches from no records. | Clear search in one action. Restore list context when going back. Test whitespace and a nonmatching term. |
| Edit → save | Identify the commit boundary. Immediate settings apply on change. Explicit editors stage a draft. Show a durable outcome only after storage succeeds. | Cancel preserves the committed version. Warn about unsaved loss where dismissal would destroy meaningful work. Test storage failure and two rapid submissions. |
| Slow operation | Acknowledge activation immediately. Keep the control width stable. Show determinate progress only when totals are meaningful. | Cancel pending work when cancellation is offered. If completion won the race, show the actual result. Never infer remote cancellation from dismissing a panel. |
| Failure → retry | Identify the failed action and how to resolve it near the task. Preserve valid values. | Retry the same intent once per activation. Disable duplicate irreversible submissions and use server-side idempotency for real transactions. |
| Delete or remove | Prefer a clearly named reversible change for ordinary removal. For an irreversible high-impact change name the affected object and impact. | For undo, restore identity, order and focus. Keep undo reachable long enough to use with a keyboard or assistive technology. |
| Onboarding | Open at the earliest useful task. Teach unfamiliar behavior at first use. | Return visits skip the lesson. Optional setup can be resumed when its feature is needed. |
| Permission | Ask in context after the feature is invoked. Explain the specific benefit and data use. | Decline leaves the broader task usable. For a location picker, offer manual entry and allow later changes. |
| Notification | Tie notification content and frequency to a chosen outcome. Deep-link into the relevant object. | On opening a stale notification, explain the object's current state and offer a nearby destination. |
| Navigation | Top-level destinations retain their own context. A deeper object gets a back path. A short blocking task may use a sheet. | Back from detail restores filter, selection and position. Resizing does not silently commit or discard work. |
| Compare readings | Put values on a common scale. Pair a plotted view with units, legend and accessible exact values. | Switch units, confirm that the underlying value and logged observations agree. |
| Collaboration | Show which version or person changed the item. Detect edits made since the draft opened. | Preserve both drafts during a conflict and explain the resolution. Never silently overwrite another person's work. |

## Write the hardest state first

A title field left blank gets “Enter a title so you can identify this print.” A failed print gets “Printer offline” plus a recovery action. A new shelf explains how a specimen gets saved. A failed search suggests a different name or a clear action. A success message states what changed and where it is available. Avoid generic errors that force the user to reconstruct the cause.

For live regions, use one polite status region for a routine update. Keep an inline error associated with its field. Use assertive announcements only when an immediate interruption is warranted. Test with real screen readers before claiming spoken behavior. [Feedback](https://developer.apple.com/design/human-interface-guidelines/feedback) · [Writing](https://developer.apple.com/design/human-interface-guidelines/writing) · [Modality](https://developer.apple.com/design/human-interface-guidelines/modality)
