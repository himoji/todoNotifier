// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::error::Error;
use serde::{Deserialize, Serialize};
use tonic::transport::Channel;
use crate::work::Work;
use crate::proto::db_api_client::DbApiClient;
use crate::proto_work::{get_all_works, add_work};

mod work;
// Remove unused modules if you don't need them
mod file_work;
mod terminal;
mod time_work;
mod string_work;
mod proto_work;

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

#[tauri::command(rename_all = "snake_case")]
async fn get_works() -> Result<Vec<Work>, Box<dyn Error>> {
    let url = "http2://[::1]:50051"; // Assuming the server uses http2
    let mut client = DbApiClient::connect(url).await?;

    let works = get_all_works(&mut client).await?;
    Ok(works)
}

#[tauri::command(rename_all = "snake_case")]
fn get_works_sync() -> Result<Vec<Work>, String> {
    tokio::task::block_in_place(|| {
        tokio::runtime::Runtime::new().unwrap().block_on(async {
            let a = get_works().await.expect("gg");//.map_err(|e| e.to_string());
            dbg!(a.clone());
            Ok(a)
        })
    })

}

#[tauri::command(rename_all = "snake_case")]
async fn set_works(works: Vec<Work>) -> Result<(), Box<dyn Error>> {
    let url = "http2://[::1]:50051"; // Assuming the server uses http2
    let mut client = DbApiClient::connect(url).await.expect("sda");

    for work in works {
        add_work(&mut client, work).await?;
    }

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
fn set_works_sync(works: Vec<Work>) -> Result<(), String> {
    tokio::task::block_in_place(|| {
        tokio::runtime::Runtime::new().unwrap().block_on(async {
            set_works(works).await.map_err(|e| e.to_string())
        })
    })
}

fn main() -> Result<(), Box<dyn Error>> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_works_sync, set_works_sync])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
