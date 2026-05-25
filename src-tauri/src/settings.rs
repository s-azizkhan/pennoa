use serde::{Deserialize, Serialize};
use std::fs;
use std::io::Write;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

#[derive(Serialize, Deserialize, Default, Clone, Debug)]
pub struct Settings {
    #[serde(default)]
    pub plane_svg: Option<String>,
    #[serde(default)]
    pub banner_variant: Option<String>,
    #[serde(default)]
    pub banner_speed: Option<String>,
}

pub struct SettingsStore {
    path: PathBuf,
    inner: Mutex<Settings>,
}

impl SettingsStore {
    pub fn load(app: &AppHandle) -> Result<Self, String> {
        let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
        fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
        let path = dir.join("settings.json");

        let inner = if path.exists() {
            let bytes = fs::read(&path).map_err(|e| e.to_string())?;
            if bytes.trim_ascii().is_empty() {
                Settings::default()
            } else {
                serde_json::from_slice::<Settings>(&bytes).map_err(|e| e.to_string())?
            }
        } else {
            Settings::default()
        };

        Ok(Self {
            path,
            inner: Mutex::new(inner),
        })
    }

    pub fn plane_svg(&self) -> Option<String> {
        self.inner.lock().unwrap().plane_svg.clone()
    }

    pub fn set_plane_svg(&self, svg: Option<String>) -> Result<(), String> {
        let mut g = self.inner.lock().unwrap();
        g.plane_svg = svg;
        let snapshot = g.clone();
        drop(g);
        self.write(&snapshot)
    }

    pub fn banner_variant(&self) -> Option<String> {
        self.inner.lock().unwrap().banner_variant.clone()
    }

    pub fn set_banner_variant(&self, variant: Option<String>) -> Result<(), String> {
        let mut g = self.inner.lock().unwrap();
        g.banner_variant = variant;
        let snapshot = g.clone();
        drop(g);
        self.write(&snapshot)
    }

    pub fn banner_speed(&self) -> Option<String> {
        self.inner.lock().unwrap().banner_speed.clone()
    }

    pub fn set_banner_speed(&self, speed: Option<String>) -> Result<(), String> {
        let mut g = self.inner.lock().unwrap();
        g.banner_speed = speed;
        let snapshot = g.clone();
        drop(g);
        self.write(&snapshot)
    }

    fn write(&self, settings: &Settings) -> Result<(), String> {
        let tmp = self.path.with_extension("json.tmp");
        let bytes = serde_json::to_vec_pretty(settings).map_err(|e| e.to_string())?;
        {
            let mut f = fs::File::create(&tmp).map_err(|e| e.to_string())?;
            f.write_all(&bytes).map_err(|e| e.to_string())?;
            f.sync_all().map_err(|e| e.to_string())?;
        }
        fs::rename(&tmp, &self.path).map_err(|e| e.to_string())
    }
}
