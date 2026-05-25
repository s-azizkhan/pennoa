use tauri::{AppHandle, WebviewUrl, WebviewWindowBuilder};

const BANNER_HEIGHT: f64 = 220.0;
const BANNER_TOP_OFFSET: f64 = 50.0;

pub fn show_banner(app: &AppHandle, title: &str, stage: Stage) -> tauri::Result<()> {
    let label = format!("overlay-{}", chrono::Utc::now().timestamp_millis());

    let width = match app.primary_monitor()? {
        Some(monitor) => {
            let size = monitor.size();
            let sf = monitor.scale_factor();
            (size.width as f64) / sf
        }
        None => 1440.0,
    };
    let y = BANNER_TOP_OFFSET;

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
