use crate::model::{Meeting, RepeatRule};
use crate::overlay::{self, Stage};
use crate::store::Store;
use crate::tray;
use chrono::{DateTime, Duration, Utc};
use std::collections::HashSet;
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Manager};

const TICK_SECS: u64 = 15;
const STALE_WINDOW_SECS: i64 = 60;
const MAX_RECURRENCE_ITERATIONS: usize = 5_000;

pub struct Scheduler {
    fired: Mutex<HashSet<(uuid::Uuid, DateTime<Utc>, i64)>>,
    paused_until: Mutex<Option<DateTime<Utc>>>,
}

impl Scheduler {
    pub fn new() -> Self {
        Self {
            fired: Mutex::new(HashSet::new()),
            paused_until: Mutex::new(None),
        }
    }

    pub fn pause_until(&self, t: DateTime<Utc>) {
        *self.paused_until.lock().unwrap() = Some(t);
    }

    pub fn resume(&self) {
        *self.paused_until.lock().unwrap() = None;
    }

    pub fn paused_until(&self) -> Option<DateTime<Utc>> {
        let mut g = self.paused_until.lock().unwrap();
        if let Some(t) = *g {
            if t > Utc::now() {
                return Some(t);
            }
            *g = None;
        }
        None
    }

    pub fn is_paused(&self) -> bool {
        self.paused_until().is_some()
    }

    fn next_occurrence(m: &Meeting, now: DateTime<Utc>) -> Option<DateTime<Utc>> {
        let cutoff = now - Duration::seconds(STALE_WINDOW_SECS);
        let mut t = m.starts_at;
        match m.repeat {
            RepeatRule::None => (t >= cutoff).then_some(t),
            RepeatRule::Daily | RepeatRule::Weekly => {
                let step = match m.repeat {
                    RepeatRule::Daily => Duration::days(1),
                    RepeatRule::Weekly => Duration::weeks(1),
                    RepeatRule::None => unreachable!(),
                };
                let mut i = 0;
                while t < cutoff && i < MAX_RECURRENCE_ITERATIONS {
                    t += step;
                    i += 1;
                }
                Some(t)
            }
        }
    }

    pub fn tick(&self, app: &AppHandle) {
        if self.is_paused() {
            return;
        }
        let now = Utc::now();
        let store = app.state::<Store>();
        for m in store.list() {
            let Some(occ) = Self::next_occurrence(&m, now) else {
                continue;
            };
            for &offset in &m.reminder_offsets_secs {
                let fire_time = occ - Duration::seconds(offset);
                let key = (m.id, occ, offset);

                if self.fired.lock().unwrap().contains(&key) {
                    continue;
                }
                if fire_time > now {
                    continue;
                }
                if fire_time + Duration::seconds(STALE_WINDOW_SECS) < now {
                    self.fired.lock().unwrap().insert(key);
                    continue;
                }

                let stage = if offset >= 600 { Stage::T10 } else { Stage::T5 };
                if let Err(e) = overlay::show_banner(app, &m.title, stage) {
                    eprintln!("show_banner failed for {}: {e}", m.title);
                }
                self.fired.lock().unwrap().insert(key);
            }
        }
    }
}

pub fn start(app: AppHandle) {
    let scheduler = Arc::new(Scheduler::new());
    app.manage(scheduler.clone());

    let tick_app = app.clone();
    tauri::async_runtime::spawn(async move {
        let mut interval = tokio::time::interval(std::time::Duration::from_secs(TICK_SECS));
        interval.tick().await; // immediate first tick — consume
        loop {
            interval.tick().await;
            scheduler.tick(&tick_app);
            tray::refresh(&tick_app);
        }
    });
}
