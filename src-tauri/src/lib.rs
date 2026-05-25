mod commands;
mod model;
mod overlay;
mod scheduler;
mod store;
mod tray;

use std::fs;
use tauri::{Manager, WindowEvent};
use tauri_plugin_autostart::ManagerExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_autostart::Builder::new()
                .build(),
        )
        .setup(|app| {
            let store = store::Store::load(&app.handle())
                .map_err(|e| format!("failed to load meeting store: {e}"))?;
            app.manage(store);

            tray::setup(&app.handle())?;
            scheduler::start(app.handle().clone());
            enable_autostart_on_first_run(&app.handle());

            Ok(())
        })
        .on_window_event(|window, event| {
            if window.label() == "main" {
                if let WindowEvent::CloseRequested { api, .. } = event {
                    api.prevent_close();
                    let _ = window.hide();
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::list_meetings,
            commands::add_meeting,
            commands::update_meeting,
            commands::delete_meeting,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn enable_autostart_on_first_run(app: &tauri::AppHandle) {
    let Ok(dir) = app.path().app_data_dir() else {
        return;
    };
    let flag = dir.join("first_run.flag");
    if flag.exists() {
        return;
    }
    let manager = app.autolaunch();
    if let Ok(false) = manager.is_enabled() {
        let _ = manager.enable();
    }
    let _ = fs::write(&flag, b"");
}
