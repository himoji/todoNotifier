// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::error::Error;
use serde::{Deserialize, Serialize};
use crate::sync_work::{get_works_sync, set_works_sync, edit_work_sync};

mod work;
// Remove unused modules if you don't need them
mod file_work;
mod terminal;
mod time_work;
mod string_work;
mod proto_work;
mod sync_work;

pub mod proto {
    tonic::include_proto!("db_api");
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command(rename_all = "snake_case")]
fn greet(name: &str) -> String {
    if name.eq("") {
        return String::from("Hello anonymous!");
    }
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() -> Result<(), Box<dyn Error>> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_works_sync, set_works_sync, edit_work_sync])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
