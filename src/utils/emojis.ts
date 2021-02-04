  import getEnv from "./getEnv";

  const { USE_CUSTOM_EMOJIS } = getEnv();

  class Emoji {
    public fallbackUnicodeEmoji: string
    private customEmoji?: string;
    constructor(fallbackUnicodeEmoji: string, customEmoji?: string) {
      this.fallbackUnicodeEmoji = fallbackUnicodeEmoji;
      this.customEmoji = customEmoji;
      if (customEmoji?.match(/^a?:.+:\d+/)) throw new Error("If custom emoji is present, it must be in :name:id or a:name:id format");
    }

    /**
     * Use it in messages
     */
    get string(): string {
      return (USE_CUSTOM_EMOJIS && this.customEmoji) ? `<${this.customEmoji}>` : this.fallbackUnicodeEmoji;
    }
    
    /**
     * Use it in reactions
     */
    get reaction(): string {
      return (USE_CUSTOM_EMOJIS && this.customEmoji) ? this.customEmoji : this.fallbackUnicodeEmoji;
    }
  }

  interface BotEmojis {
    readonly firstPage: Emoji;
    readonly previousPage: Emoji;
    readonly nextPage: Emoji;
    readonly lastPage: Emoji;
    readonly jumpPage: Emoji;
  }

  let emojis: BotEmojis = {
    firstPage: new Emoji("⏪", "firstpage:806259951830827018"),
    lastPage: new Emoji("⏩", "lastpage:806259951738683402"),
    previousPage: new Emoji("◀️", "previouspage:806259951638151190"),
    nextPage: new Emoji("▶️", "nextpage:806259951411658754"),
    jumpPage: new Emoji("↗️", "jumppage:806259951612854334"),
  };

  export default emojis;
