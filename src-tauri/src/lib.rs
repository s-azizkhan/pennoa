mod commands;
mod model;
mod overlay;
mod scheduler;
mod store;
mod tray;

use tauri::{Manager, WindowEvent};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let store = store::Store::load(&app.handle())
                .map_err(|e| format!("failed to load meeting store: {e}"))?;
            app.manage(store);

            tray::setup(&app.handle())?;
            scheduler::start(app.handle().clone());

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
