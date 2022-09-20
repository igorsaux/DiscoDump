#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use state::AppState;

mod commands;
mod discord;
mod state;

fn main() {
    tauri::Builder::default()
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            commands::set_token,
            commands::get_guilds,
            commands::get_channels,
            commands::run_collecting_messages,
            commands::save_content
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
