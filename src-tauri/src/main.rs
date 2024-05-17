// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
use serde_json::{Error, to_string};
use crate::work::Work;

mod work;
mod file_work;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command(rename_all = "snake_case")]
fn greet(name: &str) -> String {
    if name.eq("") {
        return String::from("Hello anonymous!");
    }
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![hh_mm_to_i64, new_work, save_work_to_file, get_files_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
