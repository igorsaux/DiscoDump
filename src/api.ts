import { invoke } from "@tauri-apps/api/tauri";
import type { Channel, Guild } from "./discord";
import type { LoaderSettings } from "./loader";

export async function setToken(token: string): Promise<void> {
  console.debug("invoke", "set_token", "******");
  return invoke("set_token", { token });
}

export async function getGuilds(): Promise<Guild[]> {
  console.debug("invoke", "get_guilds");
  return invoke("get_guilds");
}

export async function getChannels(guildId: string): Promise<Channel[]> {
  console.debug("invoke", "get_channels", guildId);
  return invoke("get_channels", { guildId });
}

export async function runCollectingMessages(
  channelId: string,
  options: LoaderSettings
): Promise<void> {
  console.debug("invoke", "run_collecting_messages", channelId, options);
  return invoke("run_collecting_messages", { channelId, options });
}

export async function saveContent(path: string, content: string) {
  console.debug("invoke", "save_content");
  return invoke("save_content", {
    path,
    content,
  });
}
