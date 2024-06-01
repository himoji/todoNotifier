use std::error::Error;
use crate::proto::db_api_client::DbApiClient;
use crate::proto_work::{proto_add_work, proto_get_all_works, proto_edit_work};
use crate::work::{Work, WorkParams};

#[tauri::command(rename_all = "snake_case")]
async fn get_works() -> Result<Vec<Work>, Box<dyn Error>> {
    let url = "http2://[::1]:50051"; // Assuming the server uses http2
    let mut client = DbApiClient::connect(url).await?;

    let works = proto_get_all_works(&mut client).await?;
    Ok(works)
}

#[tauri::command(rename_all = "snake_case")]
pub fn get_works_sync() -> Result<Vec<Work>, String> {
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
        proto_add_work(&mut client, work).await?;
    }

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub fn set_works_sync(works: Vec<Work>) -> Result<(), String> {
    tokio::task::block_in_place(|| {
        tokio::runtime::Runtime::new().unwrap().block_on(async {
            set_works(works).await.map_err(|e| e.to_string())
        })
    })
}

#[tauri::command(rename_all = "snake_case")]
async fn edit_work(work: Work) -> Result<(), Box<dyn Error>> {
    let url = "http2://[::1]:50051"; // Assuming the server uses http2
    let mut client = DbApiClient::connect(url).await.expect("sda");

    proto_edit_work(&mut client, work.id, WorkParams::Desc(work.desc)).await.expect("Failed to edit the work"); // for now only desc

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub fn edit_work_sync(work: Work) -> Result<(), String> {
    tokio::task::block_in_place(|| {
        tokio::runtime::Runtime::new().unwrap().block_on(async {
            crate::sync_work::edit_work(work).await.map_err(|e| e.to_string())
        })
    })
}