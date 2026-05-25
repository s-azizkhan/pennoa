mod commands;
mod model;
mod overlay;
mod scheduler;
mod store;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let store = store::Store::load(&app.handle())
                .map_err(|e| format!("failed to load meeting store: {e}"))?;
            app.manage(store);
            scheduler::start(app.handle().clone());
            Ok(())
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
