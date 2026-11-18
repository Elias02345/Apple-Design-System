use dioxus::prelude::*;

#[derive(Clone, Copy, PartialEq)]
struct ProofStyle {
    size: u8,
    open: bool,
}

const DEFAULT: ProofStyle = ProofStyle { size: 20, open: false };

/// Controlled integer range with a visible value and two exact single-step commands.
#[component]
pub fn PrecisionField(label: String, value: u8, min: u8, max: u8, onchange: EventHandler<u8>) -> Element {
    rsx! {
        fieldset { class: "sf-precision",
            legend { "{label} · {value}" }
            div {
                button { r#type: "button", aria_label: "Decrease {label}", disabled: value <= min,
                    onclick: move |_| onchange.call(value.saturating_sub(1)), "−" }
                input { r#type: "range", aria_label: "{label}", value: "{value}", min: "{min}", max: "{max}", step: "1",
                    oninput: move |event| { if let Ok(next) = event.value().parse::<u8>() { onchange.call(next.clamp(min, max)); } } }
                button { r#type: "button", aria_label: "Increase {label}", disabled: value >= max,
                    onclick: move |_| onchange.call(value.saturating_add(1)), "+" }
            }
        }
    }
}

#[component]
pub fn ReadingProof() -> Element {
    let mut style = use_signal(|| DEFAULT);
    let mut previous = use_signal(|| None::<ProofStyle>);
    let mut status = use_signal(String::new);
    let current = *style.read();
    let leading = if current.open { 1.75 } else { 1.35 };
    rsx! {
        main { class: "sf-listening sf-proof",
            h1 { "Reading proof" }
            p { class:"sf-passage", style: "font-size: {current.size as f32 / 16.0}rem; line-height: {leading};",
                "At low tide the old footpath surfaces again. Walk it slowly and the stones begin to tell you where the water goes." }
            PrecisionField { label: "Type size", min: 16, max: 36, value: current.size,
                onchange: move |v| { style.write().size = v; previous.set(None); status.set(String::new()); } }
            label { class: "sf-check", input { r#type: "checkbox", checked: current.open,
                onchange: move |e| { style.write().open = e.checked(); previous.set(None); status.set(String::new()); } }
                "Open line spacing" }
            div { class: "sf-actions",
                button { disabled: current == DEFAULT, onclick: move |_| {
                    previous.set(Some(current)); style.set(DEFAULT); status.set("Reading settings reset.".into());
                }, "Reset settings" }
                if let Some(saved) = *previous.read() {
                    button { onclick: move |_| {
                        style.set(saved); previous.set(None); status.set("Reading settings restored.".into());
                    }, "Undo reset" }
                }
            }
            p { role: "status", "{status}" }
        }
    }
}
