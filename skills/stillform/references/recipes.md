# Copy working behaviors

The public DOM helpers live in [primitives.js](../assets/web/primitives.js). Copy that file into a web project or translate the small functions into its component lifecycle. Supply native elements from the application's markup. The associated studies use the same helpers.

## Single-selection button group

Use this when several buttons change the scope of one view. Expose the group's purpose and exactly one initial pressed state. Each choice remains keyboard reachable. For actual tabs, use a tablist and associated panels with the corresponding keyboard model.

```html
<div id="units" role="group" aria-label="Height units">
  <button type="button" data-unit="m" aria-pressed="true">Metres</button>
  <button type="button" data-unit="ft" aria-pressed="false">Feet</button>
</div>
<output id="reading">1.80 m</output>
<script src="primitives.js"></script>
<script>
  const metres = 1.8;
  const detach = Stillform.exclusiveButtons(document.querySelector("#units"), button => {
    const feet = button.dataset.unit === "ft";
    const value = feet ? metres * 3.28084 : metres;
    document.querySelector("#reading").textContent = value.toFixed(2) + (feet ? " ft" : " m");
  });
</script>
```

In a dynamic view, call `detach()` when removing the group. A faster activation should always select the last chosen unit. See the [live unit switch](../assets/web/tide.js).

## An inline disclosure

```html
<button id="more" type="button" aria-expanded="false" aria-controls="extra">Lighting details</button>
<div id="extra" class="reveal" inert><div>Warm light reveals the ochre matrix.</div></div>
<script src="primitives.js"></script>
<script>
  const disclosure = Stillform.disclosure(document.querySelector("#more"), document.querySelector("#extra"));
</script>
```

Copy the `.reveal` and reduced-motion rules from [motion.css](../assets/web/motion.css) and the duration tokens from [tokens.css](../assets/web/tokens.css). When product code closes an open panel, `disclosure.setExpanded(false)` restores focus if needed. Call `destroy()` on teardown. The live case is [Lighting details](../assets/web/motion.html).

## A cancellable operation

Use `Stillform.singleTask({busy, success, failure})` to prevent duplicate submissions and ignore late completions after cancellation. Pass an operation that accepts an AbortSignal. In the print example, a local timer stands in for the printer. A server integration needs its own cancellation and duplicate-protection contract. The client can faithfully report that it stopped waiting even when the server has already accepted a job.

```js
const request = Stillform.singleTask({
  busy(active) {
    submit.disabled = active;
    cancel.hidden = !active;
    indicator.hidden = !active;
  },
  success(receipt) { status.textContent = "Saved " + receipt.name; },
  failure() { status.textContent = "Save failed. Your changes are ready to retry."; }
});
form.addEventListener("submit", event => {
  event.preventDefault();
  const draft = new FormData(form);
  request.run(async signal => {
    const response = await fetch(form.action, { method: "POST", body: draft, signal });
    if (!response.ok) throw Error("Save failed");
    return response.json();
  });
});
cancel.addEventListener("click", () => {
  request.cancel();
  status.textContent = "Stopped waiting for a response.";
  submit.focus();
});
```

Bind the form, two buttons, a labeled progress indicator and a status region from the host. The live [print form](../assets/web/controls.html) and [controller](../assets/web/controls.js) show focus placement on success, cancellation and retry.

## A native editor

The SwiftUI entry point accepts an existing model and an explicit save callback. This embeds the same tested journal used by the desktop sample.

```swift
import SwiftUI
import FieldKit

struct JournalScreen: View {
    @State private var journal = Journal.sample

    var body: some View {
        FieldJournalView(journal: journal) { updated in
            journal = updated
        }
    }
}
```

Here the host owns in-memory state. For a durable version, use the [desktop entry point](../assets/swift/Sources/FieldDesk/main.swift). For the actual sheet, save validation and confirmation semantics, inspect [FieldJournalView.swift](../assets/swift/Sources/FieldKit/FieldJournalView.swift).
