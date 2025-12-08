use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{ PathBuf};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AppConfig {
    pub tests_path: String,
    pub results_path: String,
}
impl Default for AppConfig {
    fn default() -> Self {
        Self {
            // Вкажи тут шляхи, які мають бути "за замовчуванням"
            tests_path: "./tests_data".to_string(), 
            results_path: "./results_data".to_string(),
        }
    }
}


/// Save config to given directory (dir must be a directory path)
pub fn save_config_to_dir( config: &AppConfig) -> Result<(), String> {
    let mut path = PathBuf::from("./appConfig");
    // ensure dir exists
    if !path.exists() {
        std::fs::create_dir_all(&path).map_err(|e| e.to_string())?;
    }
    path.push("tests_app_config.json");
    let json = serde_json::to_string_pretty(config).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())?;
    Ok(())
}

/// Load config from given directory (returns Err if no config)
pub fn load_config_from_dir() -> Result<AppConfig, String> {
    let mut path = PathBuf::from("./appConfig");
    path.push("tests_app_config.json");

    if !path.exists() {
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }

        let default_cfg = AppConfig::default();
        let data = serde_json::to_string_pretty(&default_cfg).map_err(|e| e.to_string())?;
        fs::write(&path, data).map_err(|e| e.to_string())?;
        
        return Ok(default_cfg);
    }

    let data = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let cfg: AppConfig = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    Ok(cfg)
}
