import {
  listen,
  type EventCallback,
  type UnlistenFn,
  type Event,
} from "@tauri-apps/api/event";
import type { Channel, Message } from "./discord";
import { runCollectingMessages } from "./api";

export type LoaderEvent =
  | "begin_collecting_messages"
  | "get_collecting_messages"
  | "end_collecting_messages";

export type LoaderCallbacks = {
  onEnd?: () => void;
  onBegin?: () => void;
  onMessages?: (messages: Message[]) => Message[];
};

export type LoaderSettings = {
  interval: number;
};

export type LoaderConfiguration = {
  settings?: LoaderSettings;
} & LoaderCallbacks;

export class MessageLoader {
  state: "NotLoading" | "Loading" | "Finished" = "NotLoading";
  messages: Message[] = [];
  channel: Channel | null = null;
  __unlisteners: UnlistenFn[] = [];
  __callbacks: LoaderCallbacks = {};
  __settings: LoaderSettings = {
    interval: 250,
  };

  async run(channel: Channel): Promise<void> {
    if (this.state === "Loading") {
      throw "MessageLoader is busy";
    }

    this.channel = channel;

    this.__registerEvent<null>(
      "begin_collecting_messages",
      this.__onBeginCollecting.bind(this)
    );

    this.__registerEvent<Message[]>(
      "get_collecting_messages",
      this.__onMessages.bind(this)
    );

    this.__registerEvent<null>(
      "end_collecting_messages",
      this.__onEndCollecting.bind(this)
    );

    return runCollectingMessages(channel.id, this.__settings);
  }

  clean() {
    if (this.state === "Loading") {
      throw "MessageLoader is busy";
    }

    console.debug("clean");
    this.state = "NotLoading";
    this.messages = [];
    this.__unlistAll();
    this.__callbacks = {};
  }

  setConfiguration(config: LoaderConfiguration) {
    console.debug("setConfiguration", config);
    this.__callbacks = {
      onBegin: config.onBegin,
      onEnd: config.onEnd,
      onMessages: config.onMessages,
    };

    if (config.settings) {
      this.__settings = config.settings;
    }
  }

  __unlistAll() {
    console.debug("unlistAll");

    this.__unlisteners.forEach((l) => l());
    this.__unlisteners = [];
  }

  async __registerEvent<T>(event: LoaderEvent, callback: EventCallback<T>) {
    console.debug("registerEvent", event);

    const unlistener = await listen<T>(event, callback);
    this.__unlisteners.push(unlistener);
  }

  __onBeginCollecting() {
    console.debug("begin_collecting_messages");

    this.state = "Loading";

    if (this.__callbacks.onBegin) {
      this.__callbacks.onBegin();
    }
  }

  __onMessages(event: Event<Message[]>) {
    console.debug("get_collecting_messages", event.payload.length);

    const messages = event.payload;
    let result = messages;

    if (this.__callbacks.onMessages) {
      result = this.__callbacks.onMessages([...result]) || [];
    }

    this.messages = this.messages.concat(result);
  }

  __onEndCollecting() {
    console.debug("end_collecting_messages");

    this.state = "Finished";

    if (this.__callbacks.onEnd) {
      this.__callbacks.onEnd();
    }
  }
}
