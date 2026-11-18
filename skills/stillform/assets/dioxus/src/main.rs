use dioxus::prelude::*;
use stillform_cues::{
    model::{self, Cue},
    CueDesk, SaveFuture, STYLE,
};

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    let mut session = use_signal(model::session);
    let mut proof = use_signal(|| false);
    let initial = session.peek().clone();
    rsx! {
        style { "{STYLE}" }
        style { ":root {{ color-scheme: light dark }} body {{ margin: 0; background: light-dark(#faf9f6,#171916) }}" }
        nav { class: "sf-destinations", aria_label: "Studies",
            button { aria_pressed: (!proof()).to_string(), onclick: move |_| proof.set(false), "Cues" }
            button { aria_pressed: proof().to_string(), onclick: move |_| proof.set(true), "Type proof" }
        }
        div { hidden: proof(),
        CueDesk { initial, duration: 120,
            oncommit: move |cue: Cue| -> SaveFuture {
                Box::pin(async move {
                    let mut cues = session.write();
                    let entry = cues.iter_mut().find(|c| c.id == cue.id)
                        .ok_or_else(|| "This cue is no longer in the session.".to_string())?;
                    *entry = cue;
                    Ok(())
                })
            }
        } }
        div { hidden: !proof(), stillform_cues::proof::ReadingProof {} }
    }
}
