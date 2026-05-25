use crate::model::{default_reminder_offsets, Meeting, NewMeetingInput, UpdateMeetingInput};
use crate::settings::SettingsStore;
use crate::store::Store;
use tauri::State;
use uuid::Uuid;

const MAX_SVG_BYTES: usize = 2 * 1024 * 1024;

#[tauri::command]
pub fn list_meetings(store: State<'_, Store>) -> Vec<Meeting> {
    store.list()
}

#[tauri::command]
pub fn add_meeting(
    store: State<'_, Store>,
    input: NewMeetingInput,
) -> Result<Meeting, String> {
    let meeting = Meeting {
        id: Uuid::new_v4(),
        title: input.title.trim().to_string(),
        starts_at: input.starts_at,
        repeat: input.repeat,
        reminder_offsets_secs: input
            .reminder_offsets_secs
            .unwrap_or_else(default_reminder_offsets),
    };
    if meeting.title.is_empty() {
        return Err("title is empty".into());
    }
    store.add(meeting.clone())?;
    Ok(meeting)
}

#[tauri::command]
pub fn update_meeting(
    store: State<'_, Store>,
    input: UpdateMeetingInput,
) -> Result<Meeting, String> {
    let meeting = Meeting {
        id: input.id,
        title: input.title.trim().to_string(),
        starts_at: input.starts_at,
        repeat: input.repeat,
        reminder_offsets_secs: input
            .reminder_offsets_secs
            .unwrap_or_else(default_reminder_offsets),
    };
    if meeting.title.is_empty() {
        return Err("title is empty".into());
    }
    store.update(meeting.clone())?;
    Ok(meeting)
}

#[tauri::command]
pub fn delete_meeting(store: State<'_, Store>, id: Uuid) -> Result<(), String> {
    store.delete(id)
}

#[tauri::command]
pub fn get_plane_svg(settings: State<'_, SettingsStore>) -> Option<String> {
    settings.plane_svg()
}

#[tauri::command]
pub fn set_plane_svg(settings: State<'_, SettingsStore>, svg: String) -> Result<(), String> {
    let trimmed = svg.trim();
    if trimmed.is_empty() {
        return Err("empty image".into());
    }
    if trimmed.len() > MAX_SVG_BYTES {
        return Err(format!(
            "image too large (>{} KB)",
            MAX_SVG_BYTES / 1024
        ));
    }
    let lower = trimmed.to_ascii_lowercase();
    let is_svg = lower.contains("<svg");
    let is_raster = lower.starts_with("data:image/png;base64,")
        || lower.starts_with("data:image/jpeg;base64,")
        || lower.starts_with("data:image/webp;base64,");
    if !is_svg && !is_raster {
        return Err("file must be SVG or PNG/JPEG/WebP".into());
    }
    settings.set_plane_svg(Some(trimmed.to_string()))
}

#[tauri::command]
pub fn clear_plane_svg(settings: State<'_, SettingsStore>) -> Result<(), String> {
    settings.set_plane_svg(None)
}

const VALID_VARIANTS: &[&str] = &[
    "pennant", "ribbon", "poster", "marquee", "postcard", "neon", "holo", "synthwave", "aurora",
    "cyber", "advert",
];

#[tauri::command]
pub fn get_banner_variant(settings: State<'_, SettingsStore>) -> String {
    settings
        .banner_variant()
        .unwrap_or_else(|| "pennant".to_string())
}

#[tauri::command]
pub fn set_banner_variant(
    settings: State<'_, SettingsStore>,
    variant: String,
) -> Result<(), String> {
    if !VALID_VARIANTS.contains(&variant.as_str()) {
        return Err(format!("unknown variant: {}", variant));
    }
    settings.set_banner_variant(Some(variant))
}

const VALID_SPEEDS: &[&str] = &["slow", "normal", "fast"];

#[tauri::command]
pub fn get_banner_speed(settings: State<'_, SettingsStore>) -> String {
    settings
        .banner_speed()
        .unwrap_or_else(|| "normal".to_string())
}

#[tauri::command]
pub fn set_banner_speed(
    settings: State<'_, SettingsStore>,
    speed: String,
) -> Result<(), String> {
    if !VALID_SPEEDS.contains(&speed.as_str()) {
        return Err(format!("unknown speed: {}", speed));
    }
    settings.set_banner_speed(Some(speed))
}
