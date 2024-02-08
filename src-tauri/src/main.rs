// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde_json::to_string;
use crate::week::{Work, Week, Year};

mod week;
mod file_work;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command(rename_all = "snake_case")]
fn greet(name: &str) -> String {
    if name.eq("") {
        return String::from("Hello anonymous!");
    }
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command(rename_all = "snake_case")]
fn get_files() -> Vec<String> {
    let files = vec!(
        String::from("first"),
        String::from("second"),
        String::from("third"));

    return files
}

#[tauri::command(rename_all = "snake_case")]
fn hh_mm_to_i64(hh_mm: &str) -> Result<i64, String> {
    if hh_mm.is_empty() { return Err("Clocks empty!".into());};
    let parts: Vec<&str> = hh_mm.split(':').collect();
    if parts.len() != 2 {
        return Err("Invalid time format".into());
    }

    let hh = parts[0].trim().parse::<i64>().map_err(|_| "Can't parse hh")?;
    let mm = parts[1].trim().parse::<i64>().map_err(|_| "Can't parse mm")?;

    Ok(chrono::Duration::seconds(60 * (hh * 60 + mm)).num_seconds())
}

#[tauri::command(rename_all = "snake_case")]
fn new_work(name: &str, desc: &str, duration: i64, start_time: i64) -> Result<Work, String> {
    if let work = Work::from_all_int(name.to_string(), desc.to_string(), duration, start_time) {
        return Ok(work);
    }
    return Err("Cant create a new work!".into());
}

#[tauri::command(rename_all = "snake_case")]
fn save_work_to_file<'a>(name: &'a str, desc: &'a str, duration: i64, start_time: i64) -> Result<&'a str, String>  {
   let work = Work::from_all_int(name.to_string(), desc.to_string(), duration, start_time);
   let mut year = Year::new();
   let mut week = Week::from(&year);
   week.monday.push(work);
   year.weeks.push(week);
   let mut path = file_work::get_current_path().map_err(|_| "Cant get path")?;
   path.push("work_dir");
   let file = file_work::create_file(&path, "json.txt").expect("bombaclat");
   file_work::write_into_file(file, to_string(&year.export()).unwrap());

    Ok("None")
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![hh_mm_to_i64, new_work, save_work_to_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
