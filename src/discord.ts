import { getChannels, getGuilds, setToken } from "./api";
import { type MessageLoader } from "./loader";

export type RoleTags = {
  bot_id: string;
  integration_id: string;
};

export type Role = {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  icon: string | undefined;
  unicode_emoji: string | undefined;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tags: RoleTags;
};

export type Emoji = {
  id: string | undefined;
  name: string | undefined;
  roles: Role[];
  user: User;
  require_colons: boolean;
  managed: boolean;
  animated: boolean;
  available: boolean;
};

export type Sticker = {
  id: string;
  pack_id: string;
  name: string;
  description: string | undefined;
  type: number;
  format_type: number;
  available: boolean;
  guild_id: string;
  user: User;
  sort_value: number;
};

export type Guild = {
  id: string;
  name: string;
  icon: string | undefined;
  icon_hash: string | undefined;
  splash: string | undefined;
  discovery_splash: string | undefined;
  owner: boolean;
  owner_id: string | undefined;
  permissions: String;
  afk_channel_id: string | undefined;
  afk_timeout: number | undefined;
  widget_enabled: boolean | undefined;
  widget_channel_id: string | undefined;
  verification_level: number | undefined;
  default_message_notifications: number | undefined;
  explicit_content_filter: number | undefined;
  roles: Role[] | undefined;
  emojis: Emoji[] | undefined;
  features: string[];
  mfa_level: number | undefined;
  application_id: string | undefined;
  system_channel_id: string | undefined;
  system_channel_flags: number;
  rules_channel_id: string | undefined;
  max_presences: number | undefined;
  max_members: number | undefined;
  vanity_url_code: string | undefined;
  description: string | undefined;
  banner: string | undefined;
  premium_tier: number | undefined;
  premium_subscription_count: number | undefined;
  preferred_locale: string | undefined;
  public_updates_channel_id: string | undefined;
  max_video_channel_users: number | undefined;
  approximate_member_count: number | undefined;
  approximate_presence_count: number | undefined;
  nsfw_level: number | undefined;
  stickers: Sticker[] | undefined;
  premium_progress_bar_enabled: boolean | undefined;
};

export type User = {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | undefined;
  bot: boolean;
  system: boolean;
  mfa_enabled: boolean;
  banner: string | undefined;
  accent_color: number | undefined;
  locale: string;
  verified: boolean;
  email: string | undefined;
  flags: number;
  premium_type: number;
  public_flags: number;
};

export type Reaction = {
  emoji_id: string;
  emoji_name: string | undefined;
};

export type ThreadMetadata = {
  archived: boolean;
  auto_archive_duration: number;
  archive_timestamp: string;
  locked: boolean;
  invitable: boolean | undefined;
  create_timestamp: string | undefined;
};

export type ThreadMemeberMetadata = {
  id: string | undefined;
  user_id: string | undefined;
  join_timestamp: string;
  flags: number;
};

export type Channel = {
  id: string;
  type: number;
  guild_id: string;
  position: number;
  permission_overwrites: string[];
  name: string | undefined;
  topic: string | undefined;
  nsfw: boolean | undefined;
  last_message_id: string | undefined;
  bitrate: number | undefined;
  user_limit: number | undefined;
  rate_limit_per_user: number | undefined;
  recipients: User[] | undefined;
  icon: string | undefined;
  owner_id: string | undefined;
  application_id: string | undefined;
  parent_id: string | undefined;
  last_pin_timestamp: string | undefined;
  rtc_region: string | undefined;
  video_quality_mode: number | undefined;
  message_count: number | undefined;
  member_count: number | undefined;
  thread_metadata: ThreadMetadata | undefined;
  member: ThreadMemeberMetadata | undefined;
  default_auto_archive_duration: number | number;
  permissions: string | undefined;
  flags: number;
  total_message_sent: number | undefined;
  applied_tags: string[] | undefined;
  default_reaction_emoji: Reaction | undefined;
  default_thread_rate_limit_per_user: number | undefined;
};

export type Message = {
  id: string;
};

export class DiscordClient {
  __cachedChannels: Map<string, Channel[]> = new Map();
  __cachedGuilds: Guild[] = [];

  async getGuilds() {
    let guilds = this.__cachedGuilds;

    if (guilds.length === 0) {
      guilds = await getGuilds();
      this.__cachedGuilds = guilds;
    }

    return guilds;
  }

  async getChannels(guild: Guild): Promise<Channel[]> {
    let channel = this.__cachedChannels.get(guild.id);

    if (!channel) {
      channel = await getChannels(guild.id);
      this.__cachedChannels.set(guild.id, channel);
    }

    return channel;
  }

  async getMessages(
    channel: Channel,
    loader: MessageLoader
  ): Promise<Message[]> {
    const promise: Promise<Message[]> = new Promise((resolve) => {
      const callback = () => {
        resolve(loader.messages);
      };
      loader.__registerEvent("end_collecting_messages", callback.bind(this));
    });

    loader.run(channel);

    return promise;
  }

  static async fromToken(token: string) {
    await setToken(token);

    return new DiscordClient();
  }
}
