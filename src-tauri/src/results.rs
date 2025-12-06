use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TestResult {
    pub student_id: String,
    pub student_name: String,
    pub score: u32,
    pub answers: serde_json::Value,
    pub timestamp: String,
}

/// Save single result: results_dir/<test_id>/<student_id>.json
pub fn save_result_to_folder(test_name: &str, results_dir: &str, result: &TestResult) -> Result<(), String> {
    let mut path = PathBuf::from(results_dir);
    if !path.exists() {
        fs::create_dir_all(&path).map_err(|e| e.to_string())?;
    }
    path.push(test_name);
    if !path.exists() {
        fs::create_dir_all(&path).map_err(|e| e.to_string())?;
    }

    path.push(format!("{}.json", result.student_id));
    let json = serde_json::to_string_pretty(result).map_err(|e| e.to_string())?;
    fs::write(&path, json).map_err(|e| e.to_string())?;
    Ok(())
}

/// Load all results for test_id: returns Vec<TestResult>
pub fn load_results_for_test(test_id: &str, results_dir: &str) -> Result<Vec<TestResult>, String> {
    let mut folder = PathBuf::from(results_dir);
    folder.push(test_id);

    if !folder.exists() {
        return Ok(vec![]); // якщо немає папки — немає результатів
    }

    let mut list = Vec::new();
    for entry in fs::read_dir(folder).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        if path.is_file() {
            let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
            let r: TestResult = serde_json::from_str(&content).map_err(|e| e.to_string())?;
            list.push(r);
        }
    }

    Ok(list)
}
