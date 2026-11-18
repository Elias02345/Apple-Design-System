pub mod model;
pub mod proof;
use dioxus::prelude::*;
use model::{Cue, Editor};
use std::{future::Future, pin::Pin, rc::Rc};

pub type SaveFuture = Pin<Box<dyn Future<Output = Result<(), String>>>>;
pub const STYLE: &str = include_str!("style.css");

#[component]
pub fn CueList(
    cues: Vec<Cue>,
    selected: usize,
    disabled: bool,
    onselect: EventHandler<usize>,
) -> Element {
    rsx! {
        section { class: "sf-cue-list", aria_label: "Cue sheet",
            h2 { "Cue sheet" }
            for (index, cue) in cues.iter().enumerate() {
                button { key: "{cue.id}", r#type: "button", disabled,
                    aria_pressed: (index == selected).to_string(), onclick: move |_| onselect.call(index),
                    span { class: "sf-time", "{cue.time()}" }
                    span { "{cue.title}" if cue.review { small { "For review" } } }
                }
            }
        }
    }
}

#[component]
pub fn CueStrip(cues: Vec<Cue>, selected: usize, duration: u32) -> Element {
    rsx! { div { class: "sf-cue-strip", aria_hidden: "true",
        for (index, cue) in cues.iter().enumerate() {
            span { key: "{cue.id}", class: if selected == index { "active" } else { "" },
                style: "left: {100.0 * cue.seconds.min(duration) as f64 / duration.max(1) as f64}%;" }
        }
    } }
}

#[component]
pub fn EditorActions(dirty: bool, busy: bool, onrevert: EventHandler<()>) -> Element {
    rsx! { div { class: "sf-actions",
        button { r#type: "submit", class: "sf-primary", disabled: busy || !dirty,
            if busy { "Saving…" } else { "Save changes" }
        }
        button { r#type: "button", disabled: busy || !dirty, onclick: move |_| onrevert.call(()), "Revert" }
    } }
}

/// Use a key when replacing the entire session. The host owns persistence and returns its outcome.
#[component]
pub fn CueDesk(initial: Vec<Cue>, duration: u32, oncommit: Callback<Cue, SaveFuture>) -> Element {
    let mut editor = use_signal(|| Editor::new(initial));
    let mut title_node = use_signal(|| None::<Rc<MountedData>>);
    let mut restore_title = use_signal(|| false);
    let snapshot = editor.read().clone();
    let Some(current) = snapshot.cues.get(snapshot.active) else {
        return rsx! { p { "No cues in this session." } };
    };
    rsx! {
        main { class: "sf-listening",
            header { p { "Field recording" } h1 { "Listening desk" }
                CueStrip { cues: snapshot.cues.clone(), selected: snapshot.active, duration }
            }
            div { class: "sf-panes",
                CueList { cues: snapshot.cues.clone(), selected: snapshot.active,
                    disabled: snapshot.busy || snapshot.pending.is_some(),
                    onselect: move |index| editor.write().select(index) }
                section { class: "sf-editor", aria_label: "Cue editor",
                    if let Some(index) = snapshot.pending {
                        h2 { "Discard changes to {current.title}?" }
                        p { "Opening {snapshot.cues[index].title} will replace this draft." }
                        div { class: "sf-actions",
                            button { class: "sf-primary", autofocus: true,
                                onmounted: move |event| async move { let _ = event.data().set_focus(true).await; },
                                onclick: move |_| { restore_title.set(true); editor.write().pending = None; }, "Keep editing" }
                            button { onclick: move |_| { restore_title.set(true); editor.write().discard_and_open(); }, "Discard and open" }
                        }
                    } else {
                        form { novalidate: true, onsubmit: move |event| {
                            event.prevent_default();
                            let proposal = editor.write().begin_save();
                            if let Some(cue) = proposal {
                                spawn(async move {
                                    let result = oncommit.call(cue.clone()).await;
                                    editor.write().finish_save(cue, result);
                                });
                            } else if editor.read().invalid {
                                let mounted = title_node.read().clone();
                                if let Some(node) = mounted { spawn(async move { let _ = node.set_focus(true).await; }); }
                            }
                        },
                            h2 { class: "sf-stamp", "{current.time()}" }
                            label { class: "sf-field", "Cue name"
                                input { r#type: "text", disabled: snapshot.busy, value: "{snapshot.title}",
                                    aria_invalid: snapshot.invalid.to_string(),
                                    onmounted: move |event| async move {
                                        let node = event.data();
                                        title_node.set(Some(node.clone()));
                                        let should_restore = *restore_title.peek();
                                        if should_restore { restore_title.set(false); let _ = node.set_focus(true).await; }
                                    },
                                    oninput: move |event| { let mut e = editor.write(); e.title = event.value(); e.invalid = false; e.message.clear(); }
                                }
                            }
                            if snapshot.invalid { p { role: "alert", class: "sf-error", "Enter a cue name." } }
                            label { class: "sf-check", input { r#type: "checkbox", checked: snapshot.review,
                                disabled: snapshot.busy, onchange: move |event| { let mut e = editor.write(); e.review = event.checked(); e.message.clear(); } }
                                "Mark for review" }
                            EditorActions { dirty: snapshot.dirty(), busy: snapshot.busy,
                                onrevert: move |_| {
                                    editor.write().reload();
                                    let mounted = title_node.read().clone();
                                    if let Some(node) = mounted { spawn(async move { let _ = node.set_focus(true).await; }); }
                                } }
                            div { role: "status", "{snapshot.message}" }
                        }
                    }
                }
            }
        }
    }
}
