use tauri::async_runtime::Mutex;

pub use crate::discord::Client as DiscordClient;

#[derive(Debug, Default)]
pub struct AppStateInner {
    pub token: Option<String>,
}

impl AppStateInner {
    pub fn set_token(&mut self, token: String) {
        self.token = Some(token)
    }

    pub fn has_token(&self) -> bool {
        self.token.is_some()
    }

    pub fn client(&self) -> DiscordClient {
        DiscordClient::new(self.token.clone().unwrap())
    }
}

#[derive(Debug, Default)]
pub struct AppState(Mutex<AppStateInner>);

impl std::ops::Deref for AppState {
    type Target = Mutex<AppStateInner>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
