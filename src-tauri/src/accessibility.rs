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

#[cfg(target_os = "windows")]
fn is_reduce_motion_impl() -> bool {
    use windows_sys::Win32::UI::WindowsAndMessaging::{
        SystemParametersInfoW, SPI_GETCLIENTAREAANIMATION,
    };
    let mut animations_enabled: i32 = 1;
    let ok = unsafe {
        SystemParametersInfoW(
            SPI_GETCLIENTAREAANIMATION,
            0,
            &mut animations_enabled as *mut _ as *mut _,
            0,
        )
    };
    if ok == 0 {
        return false;
    }
    // animations disabled == reduce motion on
    animations_enabled == 0
}

#[cfg(not(any(target_os = "macos", target_os = "windows")))]
fn is_reduce_motion_impl() -> bool {
    false
}
