/* Reduces behavior to DOM elements supplied by the caller. Safe to include on a file: page. */
"use strict";
globalThis.Stillform = Object.freeze({
  disclosure(trigger, panel) {
    const setExpanded = expanded => {
      if (!expanded && panel.contains(document.activeElement)) trigger.focus();
      trigger.setAttribute("aria-expanded", String(expanded));
      panel.inert = !expanded;
      panel.classList.toggle("expanded", expanded);
    };
    const toggle = () => setExpanded(trigger.getAttribute("aria-expanded") !== "true");
    setExpanded(trigger.getAttribute("aria-expanded") === "true");
    trigger.addEventListener("click", toggle);
    return { setExpanded, destroy: () => trigger.removeEventListener("click", toggle) };
  },

  exclusiveButtons(group, onSelect) {
    const select = button => {
      for (const choice of group.querySelectorAll("button")) {
        choice.setAttribute("aria-pressed", String(choice === button));
      }
      onSelect(button);
    };
    const click = event => {
      const button = event.target.closest("button");
      if (button && group.contains(button) && !button.disabled) select(button);
    };
    group.addEventListener("click", click);
    return () => group.removeEventListener("click", click);
  },

  // A cancelled or superseded result may never update the UI.
  singleTask({ busy, success, failure }) {
    let current = null;
    return {
      async run(operation) {
        if (current) return;
        const token = new AbortController();
        current = token;
        busy(true);
        let result;
        try { result = await operation(token.signal); }
        catch (error) {
          if (current === token) { current = null; busy(false); failure(error); }
          return;
        }
        if (current === token) { current = null; busy(false); success(result); }
      },
      cancel() {
        if (!current) return;
        const previous = current;
        current = null;
        previous.abort();
        busy(false);
      }
    };
  }
});
