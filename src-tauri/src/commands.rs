use std::{fs::File, io::Write, time::Duration};

use tauri::{AppHandle, Manager, State};

use crate::state::AppState;

#[tauri::command]
pub async fn set_token(state: State<'_, AppState>, token: String) -> Result<(), ()> {
    let mut state = state.lock().await;

    state.set_token(token);

    Ok(())
}

#[tauri::command]
pub async fn get_guilds(state: State<'_, AppState>) -> Result<serde_json::Value, String> {
    let state = state.lock().await;
    let client = state.client();

    client.get_guilds().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_channels(
    state: State<'_, AppState>,
    guild_id: String,
) -> Result<serde_json::Value, String> {
    let state = state.lock().await;
    let client = state.client();

    client
        .get_channels(&guild_id)
        .await
        .map_err(|e| e.to_string())
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct CollectingMessagesOptions {
    interval: u64,
}

#[tauri::command]
pub async fn run_collecting_messages(
    state: State<'_, AppState>,
    app: AppHandle,
    channel_id: String,
    options: CollectingMessagesOptions,
) -> Result<(), ()> {
    #[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
    struct Message {
        id: String,
    }

    let state = state.lock().await;
    let mut last_message_id: Option<String> = None;

    app.emit_all("begin_collecting_messages", ()).unwrap();

    loop {
        let messages_json = state
            .client()
            .get_messages(&channel_id, last_message_id.as_ref())
            .await
            .unwrap();

        if let Ok(messages) = serde_json::from_value::<Vec<Message>>(messages_json.clone()) {
            if messages.is_empty() {
                break;
            }

            if let Some(id) = &last_message_id {
                if messages.iter().any(|m| &m.id == id) {
                    break;
                }
            }

            last_message_id = Some(messages.last().unwrap().id.clone());
        } else {
            break;
        }

        app.emit_all("get_collecting_messages", messages_json)
            .unwrap();

        if options.interval > 0 {
            std::thread::sleep(Duration::from_millis(options.interval));
        }
    }

    app.emit_all("end_collecting_messages", ()).unwrap();

    Ok(())
}

#[tauri::command]
pub fn save_content(path: String, content: String) -> Result<(), ()> {
    let mut file = File::create(path).unwrap();
    file.write_all(content.as_bytes()).unwrap();

    Ok(())
}
