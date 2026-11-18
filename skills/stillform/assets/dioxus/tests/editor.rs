use stillform_cues::model::{session, Editor};

#[test]
fn dirty_navigation_can_keep_or_discard_and_preserves_identity() {
    let mut s = Editor::new(session());
    s.title = "Draft".into();
    s.select(2);
    assert_eq!(s.pending, Some(2));
    assert_eq!(s.active, 0);
    s.pending = None;
    assert_eq!(s.title, "Draft");
    s.select(1);
    s.discard_and_open();
    assert_eq!(s.title, "Door closes");
    assert_eq!(s.cues[0].title, "Room tone");
    assert!(s.review);
}

#[test]
fn invalid_failed_duplicate_and_successful_saves_have_distinct_outcomes() {
    let mut s = Editor::new(session());
    s.title = " ".into();
    assert!(s.begin_save().is_none() && s.invalid);
    s.title = "  After rain ".into();
    s.review = true;
    let cue = s.begin_save().unwrap();
    assert!(s.begin_save().is_none());
    s.select(2);
    assert_eq!(s.active, 0);
    s.finish_save(cue, Err("Offline; try again".into()));
    assert_eq!(s.title, "  After rain ");
    assert_eq!(s.cues[0].title, "Room tone");
    let cue = s.begin_save().unwrap();
    s.finish_save(cue, Ok(()));
    assert_eq!(s.cues[0].id, "room");
    assert_eq!(s.cues[0].time(), "00:08");
    assert_eq!(s.cues[0].title, "After rain");
    assert!(s.cues[0].review);
    assert!(!s.dirty());
}

#[test]
fn empty_session_and_unknown_selection_do_not_start_work() {
    let mut s = Editor::new(Vec::new());
    s.select(3);
    assert!(s.begin_save().is_none());
    assert!(s.pending.is_none());
}
