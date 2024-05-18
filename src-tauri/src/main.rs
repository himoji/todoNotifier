// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use crate::work::Work;

mod work;
mod file_work;
#[derive(Serialize, Deserialize)]
pub struct TauriWork {
    pub work: Work, // nice inheritance
    pub progress: u8,
}
impl TauriWork{
    pub fn new(work: Work) -> Self {
        let progress = work.get_time_progress();
        TauriWork { work, progress }
    }

    // Method to access work details
    pub fn get_work_details(&self) -> &Work {
        &self.work
    }
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command(rename_all = "snake_case")]
fn greet(name: &str) -> String {
    if name.eq("") {
        return String::from("Hello anonymous!");
    }
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command(rename_all = "snake_case")]
fn get_works() -> Result<Vec<TauriWork>, String> {
    let works = vec![
        TauriWork::new(Work {
            name: String::from("Task 1"),
            desc: String::from("This is the first task"),
            date_start: 1652736000,
            date_end: 1652822400,
        }),
        TauriWork::new(Work {
            name: String::from("Task 1"),
            desc: String::from("This is the first task"),
            date_start: 1652736000,
            date_end: 1652822400,
        }),
        TauriWork::new(Work {
            name: String::from("Task 1"),
            desc: String::from("This is the first task"),
            date_start: 1652736000,
            date_end: 1652822400,
        }),
        TauriWork::new(Work {
            name: String::from("Task 1"),
            desc: String::from("This is the first task"),
            date_start: 1652736000,
            date_end: 1652822400,
        }),
        TauriWork::new(Work {
            name: String::from("Task 1"),
            desc: String::from("This is the first task"),
            date_start: 1652736000,
            date_end: 1652822400,
        }),TauriWork::new(Work {
            name: String::from("Task 1"),
            desc: String::from("This is the first task"),
            date_start: 1652736000,
            date_end: 1652822400,
        }),TauriWork::new(Work {
            name: String::from("Task 1"),
            desc: String::from("This is the first task"),
            date_start: 1652736000,
            date_end: 1652822400,
        }),



    ];

    Ok(works)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_works])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
