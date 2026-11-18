#[derive(Clone, Debug, PartialEq)]
pub struct Cue {
    pub id: String,
    pub seconds: u32,
    pub title: String,
    pub review: bool,
}

impl Cue {
    pub fn time(&self) -> String {
        format!("{:02}:{:02}", self.seconds / 60, self.seconds % 60)
    }
}

pub fn session() -> Vec<Cue> {
    [
        ("room", 8, "Room tone", false),
        ("door", 46, "Door closes", true),
        ("steps", 93, "Footsteps on stone", false),
    ]
    .into_iter()
    .map(|(id, seconds, title, review)| Cue {
        id: id.into(),
        seconds,
        title: title.into(),
        review,
    })
    .collect()
}

#[derive(Clone, PartialEq)]
pub struct Editor {
    pub cues: Vec<Cue>,
    pub active: usize,
    pub pending: Option<usize>,
    pub title: String,
    pub review: bool,
    pub busy: bool,
    pub message: String,
    pub invalid: bool,
}

impl Editor {
    pub fn new(cues: Vec<Cue>) -> Self {
        let mut editor = Self {
            cues,
            active: 0,
            pending: None,
            title: String::new(),
            review: false,
            busy: false,
            message: String::new(),
            invalid: false,
        };
        editor.reload();
        editor
    }

    pub fn dirty(&self) -> bool {
        self.cues
            .get(self.active)
            .is_some_and(|c| c.title != self.title || c.review != self.review)
    }

    pub fn reload(&mut self) {
        if let Some(cue) = self.cues.get(self.active) {
            self.title.clone_from(&cue.title);
            self.review = cue.review;
        }
        self.pending = None;
        self.invalid = false;
        self.message.clear();
    }

    pub fn select(&mut self, index: usize) {
        if self.busy || index >= self.cues.len() || self.active == index {
            return;
        }
        if self.dirty() {
            self.pending = Some(index);
        } else {
            self.active = index;
            self.reload();
        }
    }

    pub fn discard_and_open(&mut self) {
        if let Some(index) = self.pending.take() {
            self.active = index;
            self.reload();
        }
    }

    pub fn begin_save(&mut self) -> Option<Cue> {
        if self.busy || self.pending.is_some() || !self.dirty() {
            return None;
        }
        self.invalid = self.title.trim().is_empty();
        self.message.clear();
        if self.invalid {
            return None;
        }
        let mut value = self.cues[self.active].clone();
        value.title = self.title.trim().to_owned();
        value.review = self.review;
        self.busy = true;
        Some(value)
    }

    pub fn finish_save(&mut self, value: Cue, result: Result<(), String>) {
        self.busy = false;
        match result {
            Ok(()) => {
                self.cues[self.active] = value;
                self.reload();
                self.message = "Changes saved.".into();
            }
            Err(message) => self.message = message,
        }
    }
}
