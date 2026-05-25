#[tauri::command]
pub fn is_reduce_motion() -> bool {
    is_reduce_motion_impl()
}

#[cfg(target_os = "macos")]
fn is_reduce_motion_impl() -> bool {
    use std::process::Command;
    let out = Command::new("defaults")
        .args([
            "read",
            "-g",
            "com.apple.universalaccess",
            "reduceMotionEnabled",
        ])
        .output();
    match out {
        Ok(o) => String::from_utf8_lossy(&o.stdout).trim() == "1",
        Err(_) => false,
    }
}

// Windows path will read SPI_GETCLIENTAREAANIMATION via the win32 API
// when the cross-platform port lands. Falls back to false until then.
#[cfg(not(target_os = "macos"))]
fn is_reduce_motion_impl() -> bool {
    false
}
