import { defineStore } from "pinia";
import { MessageLoader } from "../loader";
import { saveContent } from "../api";
import { type Channel, DiscordClient, type Guild } from "../discord";

export type WindowState = "login" | "guilds" | "channels" | "loading";

export const useAppStore = defineStore("app", {
  state: () => ({
    client: null as DiscordClient | null,
    window: "login" as WindowState,
    selectedGuild: null as Guild | null,
    selectedChannel: null as Channel | null,
    loader: new MessageLoader(),
  }),
  actions: {
    async initClient(token: string) {
      this.client = await DiscordClient.fromToken(token);
    },
    openLoginWindow() {
      console.debug("openLoginWindow");
      this.window = "login";
    },
    openGuildsWindow() {
      console.debug("openGuildsWindow");
      this.window = "guilds";
    },
    openChannelsWindow() {
      console.debug("openChannelsWindow");
      this.window = "channels";
    },
    openLoadingWindow() {
      console.debug("openLoadingWindow");
      this.window = "loading";
    },
    selectGuild(guild: Guild) {
      this.selectedGuild = guild;
      this.selectedChannel = null;
    },
    selectChannel(channel: Channel) {
      this.selectedChannel = channel;
    },
    logout() {
      this.openLoginWindow();
      this.client = null;
      this.selectedGuild = null;
      this.selectedChannel = null;
    },
    async saveContent(path: string, content: string) {
      await saveContent(path, content);
    },
  },
});
