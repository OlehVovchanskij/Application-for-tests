#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod config;
mod tests;
mod results;

use crate::config::{load_config_from_dir, save_config_to_dir, AppConfig};
use crate::results::{load_results_for_test, save_result_to_folder, TestResult};
use crate::tests::load_tests_from_folder;


use tauri_plugin_dialog;
#[tauri::command]
fn save_config( config: AppConfig) -> Result<(), String> {
    save_config_to_dir(&config)
}

#[tauri::command]
fn load_config() -> Result<AppConfig, String> {
    load_config_from_dir()
}

#[tauri::command]
fn load_tests(folder: String) -> Result<Vec<(String, serde_json::Value)>, String> {
    load_tests_from_folder(&folder)
}

#[tauri::command]
fn save_result(test_id: String, results_dir: String, result: TestResult) -> Result<(), String> {
    save_result_to_folder(&test_id, &results_dir, &result)
}

#[tauri::command]
fn load_results(test_id: String, results_dir: String) -> Result<Vec<TestResult>, String> {
    load_results_for_test(&test_id, &results_dir)
}

#[tauri::command]
fn save_test(folder: String, filename: String, test_data: serde_json::Value) -> Result<(), String> {
    crate::tests::save_test(&folder, &filename, &test_data)
}

#[tauri::command]
fn update_test(folder: String, old_filename: String, new_filename: String, test_data: serde_json::Value) -> Result<(), String> {
    crate::tests::update_test(&folder, &old_filename, &new_filename, &test_data)
}
#[tauri::command]
fn delete_test(tests_folder: String, results_folder: String, test_filename: String) -> Result<(), String> {
    crate::tests::delete_test_and_results(&tests_folder, &results_folder, &test_filename)
}

fn main() {
    tauri::Builder::default()
        
        
        .invoke_handler(tauri::generate_handler![
            save_config,
            load_config,
            load_tests,
            delete_test,
            save_result,
            load_results,
            save_test,
            update_test
        ])
        .plugin(tauri_plugin_dialog::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
