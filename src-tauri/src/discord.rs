use bitflags::bitflags;
use reqwest::Client as HttpClient;
use serde::{Deserialize, Serialize};

static BASE_URL: &str = "https://discord.com/api/v10";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Snowflake(String);

impl std::fmt::Display for Snowflake {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.0.fmt(f)
    }
}

impl std::ops::Deref for Snowflake {
    type Target = str;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[derive(Debug)]
pub struct Client {
    token: String,
    http: HttpClient,
}

impl Client {
    pub fn new(token: String) -> Self {
        Self {
            http: HttpClient::new(),
            token,
        }
    }

    async fn get(&self, url: String) -> Result<reqwest::Response, reqwest::Error> {
        self.http
            .get(url)
            .header("Authorization", &self.token)
            .send()
            .await
    }

    pub async fn get_guilds(&self) -> Result<serde_json::Value, anyhow::Error> {
        let response = self
            .get(format!("{BASE_URL}/users/@me/guilds"))
            .await?
            .json::<serde_json::Value>()
            .await?;

        Ok(response)
    }

    pub async fn get_channels(&self, guild_id: &str) -> Result<serde_json::Value, anyhow::Error> {
        let response = self
            .get(format!("{BASE_URL}/guilds/{guild_id}/channels"))
            .await?
            .json::<serde_json::Value>()
            .await?;

        Ok(response)
    }

    pub async fn get_messages(
        &self,
        channel_id: &str,
        before: Option<&String>,
    ) -> Result<serde_json::Value, anyhow::Error> {
        let url = match &before {
            None => format!("{BASE_URL}/channels/{channel_id}/messages"),
            Some(id) => format!("{BASE_URL}/channels/{channel_id}/messages?before={id}"),
        };

        let response = self.get(url).await?.json::<serde_json::Value>().await?;

        Ok(response)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RoleTags {
    bot_id: Snowflake,
    integration_id: Snowflake,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Role {
    pub id: Snowflake,
    pub name: String,
    pub color: i32,
    pub hoist: bool,
    pub icon: Option<String>,
    pub unicode_emoji: Option<String>,
    pub position: i32,
    pub permissions: String,
    pub managed: bool,
    pub mentionable: bool,
    pub tags: RoleTags,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Emoji {
    pub id: Option<Snowflake>,
    pub name: Option<String>,
    pub roles: Vec<Role>,
    pub user: User,
    pub require_colons: bool,
    pub managed: bool,
    pub animated: bool,
    pub available: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Sticker {
    pub id: Snowflake,
    pub pack_id: Snowflake,
    pub name: String,
    pub description: Option<String>,
    #[serde(alias = "type")]
    pub ty: i32,
    pub format_type: i32,
    pub available: bool,
    pub guild_id: Snowflake,
    pub user: User,
    pub sort_value: i32,
}

bitflags! {
    #[derive(Serialize, Deserialize)]
    pub struct UserFlags: u32 {
        const STAFF = 1 << 0;
        const PARTNER = 1 << 1;
        const HYPESQUAD = 1 << 2;
        const BUG_HUNTER_LEVEL_1 = 1 << 3;
        const HYPESQUAD_ONLINE_HOUSE_1 = 1 << 6;
        const HYPESQUAD_ONLINE_HOUSE_2 = 1 << 7;
        const HYPESQUAD_ONLINE_HOUSE_3 = 1 << 8;
        const PREMIUM_EARLY_SUPPORTER = 1 << 9;
        const TEAM_PSEUDO_USER = 1 << 10;
        const BUG_HUNTER_LEVEL_2 = 1 << 14;
        const VERIFIED_BOT = 1 << 16;
        const VERIFIED_DEVELOPER = 1 << 17;
        const CERTIFIED_MODERATOR = 1 << 18;
        const BOT_HTTP_INTERACTIONS = 1 << 19;
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: Snowflake,
    pub username: String,
    pub discriminator: String,
    pub avatar: Option<String>,
    pub bot: bool,
    pub system: bool,
    pub mfa_enabled: bool,
    pub banner: Option<String>,
    pub accent_color: Option<i32>,
    pub locale: String,
    pub verified: bool,
    pub email: Option<String>,
    pub flags: UserFlags,
    pub premium_type: i32,
    pub public_flags: UserFlags,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Guild {
    pub id: Snowflake,
    pub name: String,
    pub icon: Option<String>,
    pub icon_hash: Option<String>,
    pub splash: Option<String>,
    pub discovery_splash: Option<String>,
    pub owner: bool,
    pub owner_id: Option<Snowflake>,
    pub permissions: String,
    pub afk_channel_id: Option<Snowflake>,
    pub afk_timeout: Option<i32>,
    pub widget_enabled: Option<bool>,
    pub widget_channel_id: Option<Snowflake>,
    pub verification_level: i32,
    pub default_message_notifications: i32,
    pub explicit_content_filter: i32,
    pub roles: Vec<Role>,
    pub emojis: Vec<Emoji>,
    pub features: Vec<String>,
    pub mfa_level: i32,
    pub application_id: Option<Snowflake>,
    pub system_channel_id: Option<Snowflake>,
    pub system_channel_flags: i32,
    pub rules_channel_id: Option<Snowflake>,
    pub max_presences: i32,
    pub max_members: i32,
    pub vanity_url_code: Option<String>,
    pub description: Option<String>,
    pub banner: Option<String>,
    pub premium_tier: i32,
    pub premium_subscription_count: i32,
    pub preferred_locale: String,
    pub public_updates_channel_id: Option<Snowflake>,
    pub max_video_channel_users: i32,
    pub approximate_member_count: i32,
    pub approximate_presence_count: i32,
    pub nsfw_level: i32,
    pub stickers: Vec<Sticker>,
    pub premium_progress_bar_enabled: bool,
}
