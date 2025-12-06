use serde_json::Value;
use std::fs;
use std::path::PathBuf;

/// Read all .json files from `folder` and return vector of (filename, parsed json)
pub fn load_tests_from_folder(folder: &str) -> Result<Vec<(String, Value)>, String> {
    let mut result = Vec::new();
    let dir = PathBuf::from(folder);

    if !dir.exists() {
        return Err("tests folder does not exist".into());
    }

    for entry in fs::read_dir(dir).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        if path.is_file() {
            if let Some(ext) = path.extension() {
                if ext == "json" {
                    let name = path
                        .file_name()
                        .map(|s| s.to_string_lossy().to_string())
                        .unwrap_or_else(|| "unknown".into());
                    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
                    let json: Value = serde_json::from_str(&content).map_err(|e| e.to_string())?;
                    result.push((name, json));
                }
            }
        }
    }

    Ok(result)
}


pub fn save_test(folder: &str, filename: &str, test_data: &Value) -> Result<(), String> {
    let dir = PathBuf::from(folder);
    if !dir.exists() {
        fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    }

    let mut path = dir.join(filename);
    if path.extension().is_none() {
        path.set_extension("json");
    }

    let json_string = serde_json::to_string_pretty(test_data).map_err(|e| e.to_string())?;
    fs::write(path, json_string).map_err(|e| e.to_string())?;

    Ok(())
}

pub fn update_test(folder: &str, old_filename: &str, new_filename: &str, test_data: &Value) -> Result<(), String> {
    if old_filename != new_filename {
        let mut old_path = PathBuf::from(folder).join(old_filename);
        if old_path.extension().is_none() {
            old_path.set_extension("json");
        }
        
        if old_path.exists() {
            fs::remove_file(old_path).map_err(|e| e.to_string())?;
        }
    }

    save_test(folder, new_filename, test_data)
}