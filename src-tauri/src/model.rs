use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Meeting {
    pub id: Uuid,
    pub title: String,
    pub starts_at: DateTime<Utc>,
    #[serde(default)]
    pub repeat: RepeatRule,
    #[serde(default = "default_reminder_offsets")]
    pub reminder_offsets_secs: Vec<i64>,
}

#[derive(Serialize, Deserialize, Clone, Copy, Debug, Default, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum RepeatRule {
    #[default]
    None,
    Daily,
    Weekly,
}

pub fn default_reminder_offsets() -> Vec<i64> {
    vec![600, 300]
}

#[derive(Deserialize, Debug)]
pub struct NewMeetingInput {
    pub title: String,
    pub starts_at: DateTime<Utc>,
    #[serde(default)]
    pub repeat: RepeatRule,
    pub reminder_offsets_secs: Option<Vec<i64>>,
}

#[derive(Deserialize, Debug)]
pub struct UpdateMeetingInput {
    pub id: Uuid,
    pub title: String,
    pub starts_at: DateTime<Utc>,
    #[serde(default)]
    pub repeat: RepeatRule,
    pub reminder_offsets_secs: Option<Vec<i64>>,
}
