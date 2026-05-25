mod overlay;

use std::time::Duration;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Hide main window for M2 — only the overlay should be visible.
            if let Some(main) = app.get_webview_window("main") {
                let _ = main.hide();
            }

            // Walking-skeleton trigger: fire one banner 10s after launch.
            let handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                tokio::time::sleep(Duration::from_secs(10)).await;
                if let Err(e) =
                    overlay::show_banner(&handle, "standup with the team", overlay::Stage::T10)
                {
                    eprintln!("show_banner failed: {e}");
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
