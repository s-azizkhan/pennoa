use tauri::{AppHandle, WebviewUrl, WebviewWindowBuilder};

const BANNER_HEIGHT: f64 = 200.0;
const BANNER_TOP_RATIO: f64 = 0.0;

#[allow(dead_code)] // wired into scheduler in M4
pub fn show_banner(app: &AppHandle, title: &str, stage: Stage) -> tauri::Result<()> {
    let label = format!("overlay-{}", chrono::Utc::now().timestamp_millis());

    let (width, y) = match app.primary_monitor()? {
        Some(monitor) => {
            let size = monitor.size();
            let sf = monitor.scale_factor();
            let w = (size.width as f64) / sf;
            let h = (size.height as f64) / sf;
            (w, h * BANNER_TOP_RATIO)
        }
        None => (1440.0, 0.0),
    };

    let url = format!(
        "overlay.html?title={}&stage={}",
        percent_encode(title),
        stage.as_str()
    );

    let window = WebviewWindowBuilder::new(app, &label, WebviewUrl::App(url.into()))
        .title("Pennoa Banner")
        .transparent(true)
        .decorations(false)
        .always_on_top(true)
        .visible_on_all_workspaces(true)
        .shadow(false)
        .skip_taskbar(true)
        .resizable(false)
        .focused(false)
        .inner_size(width, BANNER_HEIGHT)
        .position(0.0, y)
        .build()?;

    // The defining behavior: pointer events pass through to apps below.
    window.set_ignore_cursor_events(true)?;

    Ok(())
}

#[derive(Clone, Copy, Debug)]
#[allow(dead_code)] // T5 used in M4 scheduler
pub enum Stage {
    T10,
    T5,
}

impl Stage {
    fn as_str(self) -> &'static str {
        match self {
            Stage::T10 => "t10",
            Stage::T5 => "t5",
        }
    }
}

fn percent_encode(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for byte in s.bytes() {
        match byte {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                out.push(byte as char);
            }
            _ => out.push_str(&format!("%{:02X}", byte)),
        }
    }
    out
}
