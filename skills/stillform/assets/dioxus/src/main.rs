use dioxus::prelude::*;
use stillform_cues::{model::{self, Cue}, CueDesk, SaveFuture, STYLE};

fn main() { dioxus::launch(App); }

#[component]
fn App() -> Element {
    let mut session = use_signal(model::session);
    let initial = session.peek().clone();
    rsx! {
        style { "{STYLE}" }
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
        }
    }
}
