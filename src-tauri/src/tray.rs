use crate::overlay::{self, Stage};
use crate::scheduler::Scheduler;
use crate::store::Store;
use chrono::{DateTime, Duration, Local, TimeZone, Utc};
use std::sync::Arc;
use tauri::menu::{Menu, MenuBuilder, MenuItemBuilder, PredefinedMenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::{AppHandle, Manager};

const TRAY_ID: &str = "main";

pub fn setup(app: &AppHandle) -> tauri::Result<()> {
    let icon = app
        .default_window_icon()
        .cloned()
        .expect("bundled window icon should be present");

    let menu = build_menu(app)?;

    let _tray = TrayIconBuilder::with_id(TRAY_ID)
        .icon(icon)
        .icon_as_template(true)
        .tooltip("Pennoa")
        .menu(&menu)
        .on_menu_event(|app, event| handle_menu(app, event.id().as_ref()))
        .build(app)?;

    Ok(())
}

pub fn refresh(app: &AppHandle) {
    if let Some(tray) = app.tray_by_id(TRAY_ID) {
        match build_menu(app) {
            Ok(menu) => {
                let _ = tray.set_menu(Some(menu));
            }
            Err(e) => eprintln!("tray refresh failed: {e}"),
        }
    }
}

fn build_menu(app: &AppHandle) -> tauri::Result<Menu<tauri::Wry>> {
    let status_label = status_label(app);

    let status = MenuItemBuilder::new(status_label)
        .id("status")
        .enabled(false)
        .build(app)?;

    let pause_1h = MenuItemBuilder::new("Pause for 1 hour")
        .id("pause-1h")
        .build(app)?;
    let pause_tomorrow = MenuItemBuilder::new("Pause until tomorrow")
        .id("pause-tomorrow")
        .build(app)?;
    let resume = MenuItemBuilder::new("Resume reminders")
        .id("resume")
        .enabled(is_paused(app))
        .build(app)?;

    let open = MenuItemBuilder::new("Open Pennoa").id("open").build(app)?;
    let test = MenuItemBuilder::new("Test banner").id("test").build(app)?;
    let quit = MenuItemBuilder::new("Quit")
        .id("quit")
        .accelerator("Cmd+Q")
        .build(app)?;

    let sep1 = PredefinedMenuItem::separator(app)?;
    let sep2 = PredefinedMenuItem::separator(app)?;
    let sep3 = PredefinedMenuItem::separator(app)?;

    MenuBuilder::new(app)
        .items(&[
            &status,
            &sep1,
            &pause_1h,
            &pause_tomorrow,
            &resume,
            &sep2,
            &open,
            &test,
            &sep3,
            &quit,
        ])
        .build()
}

fn status_label(app: &AppHandle) -> String {
    if let Some(scheduler) = app.try_state::<Arc<Scheduler>>() {
        if let Some(until) = scheduler.paused_until() {
            let local: DateTime<Local> = until.with_timezone(&Local);
            return format!("Paused until {}", local.format("%a %H:%M"));
        }
    }

    match next_meeting(app) {
        Some((title, mins)) => {
            let truncated = truncate(&title, 28);
            if mins <= 0 {
                format!("Next: {} · now", truncated)
            } else {
                format!("Next: {} · {} min", truncated, mins)
            }
        }
        None => "No upcoming meetings".to_string(),
    }
}

fn next_meeting(app: &AppHandle) -> Option<(String, i64)> {
    let store = app.state::<Store>();
    let now = Utc::now();
    let mut best: Option<(String, DateTime<Utc>)> = None;
    for m in store.list() {
        let mut t = m.starts_at;
        let step = match m.repeat {
            crate::model::RepeatRule::None => None,
            crate::model::RepeatRule::Daily => Some(Duration::days(1)),
            crate::model::RepeatRule::Weekly => Some(Duration::weeks(1)),
        };
        match step {
            Some(s) => {
                let mut i = 0;
                while t < now && i < 5_000 {
                    t += s;
                    i += 1;
                }
            }
            None => {
                if t < now {
                    continue;
                }
            }
        }
        match &best {
            Some((_, bt)) if *bt < t => {}
            _ => best = Some((m.title.clone(), t)),
        }
    }
    best.map(|(title, t)| (title, (t - now).num_minutes()))
}

fn is_paused(app: &AppHandle) -> bool {
    app.try_state::<Arc<Scheduler>>()
        .map(|s| s.is_paused())
        .unwrap_or(false)
}

fn truncate(s: &str, max: usize) -> String {
    if s.chars().count() <= max {
        s.to_string()
    } else {
        let mut out: String = s.chars().take(max - 1).collect();
        out.push('…');
        out
    }
}

fn handle_menu(app: &AppHandle, id: &str) {
    match id {
        "pause-1h" => set_pause(app, Utc::now() + Duration::hours(1)),
        "pause-tomorrow" => set_pause(app, tomorrow_local_midnight()),
        "resume" => {
            if let Some(s) = app.try_state::<Arc<Scheduler>>() {
                s.resume();
            }
            refresh(app);
        }
        "open" => open_main(app),
        "test" => {
            if let Err(e) = overlay::show_banner(app, "test banner — pennoa", Stage::T10) {
                eprintln!("test banner failed: {e}");
            }
        }
        "quit" => app.exit(0),
        _ => {}
    }
}

fn set_pause(app: &AppHandle, until: DateTime<Utc>) {
    if let Some(s) = app.try_state::<Arc<Scheduler>>() {
        s.pause_until(until);
    }
    refresh(app);
}

fn open_main(app: &AppHandle) {
    if let Some(win) = app.get_webview_window("main") {
        let _ = win.show();
        let _ = win.set_focus();
        let _ = win.unminimize();
    }
}

fn tomorrow_local_midnight() -> DateTime<Utc> {
    let now = Local::now();
    let date = now.date_naive() + chrono::Days::new(1);
    let naive = date.and_hms_opt(0, 0, 0).expect("valid midnight");
    Local
        .from_local_datetime(&naive)
        .single()
        .expect("local midnight unambiguous")
        .with_timezone(&Utc)
}
