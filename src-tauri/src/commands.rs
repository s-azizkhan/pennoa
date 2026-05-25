use crate::model::{default_reminder_offsets, Meeting, NewMeetingInput, UpdateMeetingInput};
use crate::store::Store;
use tauri::State;
use uuid::Uuid;

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
