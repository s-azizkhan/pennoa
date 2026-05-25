use crate::model::Meeting;
use std::fs;
use std::io::Write;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};
use uuid::Uuid;

pub struct Store {
    path: PathBuf,
    inner: Mutex<Vec<Meeting>>,
}

impl Store {
    pub fn load(app: &AppHandle) -> Result<Self, String> {
        let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
        fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
        let path = dir.join("meetings.json");

        let inner = if path.exists() {
            let bytes = fs::read(&path).map_err(|e| e.to_string())?;
            if bytes.trim_ascii().is_empty() {
                Vec::new()
            } else {
                serde_json::from_slice::<Vec<Meeting>>(&bytes).map_err(|e| e.to_string())?
            }
        } else {
            Vec::new()
        };

        Ok(Self {
            path,
            inner: Mutex::new(inner),
        })
    }

    pub fn list(&self) -> Vec<Meeting> {
        let mut g = self.inner.lock().unwrap().clone();
        g.sort_by_key(|m| m.starts_at);
        g
    }

    pub fn add(&self, m: Meeting) -> Result<(), String> {
        let mut g = self.inner.lock().unwrap();
        g.push(m);
        self.write_locked(&g)
    }

    pub fn update(&self, m: Meeting) -> Result<(), String> {
        let mut g = self.inner.lock().unwrap();
        let i = g
            .iter()
            .position(|x| x.id == m.id)
            .ok_or_else(|| format!("meeting {} not found", m.id))?;
        g[i] = m;
        self.write_locked(&g)
    }

    pub fn delete(&self, id: Uuid) -> Result<(), String> {
        let mut g = self.inner.lock().unwrap();
        let before = g.len();
        g.retain(|m| m.id != id);
        if g.len() == before {
            return Err(format!("meeting {} not found", id));
        }
        self.write_locked(&g)
    }

    fn write_locked(&self, list: &Vec<Meeting>) -> Result<(), String> {
        let tmp = self.path.with_extension("json.tmp");
        let bytes = serde_json::to_vec_pretty(list).map_err(|e| e.to_string())?;
        {
            let mut f = fs::File::create(&tmp).map_err(|e| e.to_string())?;
            f.write_all(&bytes).map_err(|e| e.to_string())?;
            f.sync_all().map_err(|e| e.to_string())?;
        }
        fs::rename(&tmp, &self.path).map_err(|e| e.to_string())
    }
}
