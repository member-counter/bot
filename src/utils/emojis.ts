  import getEnv from "./getEnv";

  const { USE_CUSTOM_EMOJIS } = getEnv();

  class Emoji {
    public fallbackUnicodeEmoji: string
    private customEmoji?: string;
    constructor(fallbackUnicodeEmoji: string, customEmoji?: string) {
      this.fallbackUnicodeEmoji = fallbackUnicodeEmoji;
      this.customEmoji = customEmoji;
      if (customEmoji?.match(/^a?::.+:\d+/)) throw new Error("If custom emoji is present, it must be in :name:id or a:name:id format");
    }
    /**
     *  Get name for paginator collector
     */
    get name(): string {
      return (USE_CUSTOM_EMOJIS && this.customEmoji) ? this.customEmoji.match(/(?::)|\b(\w*)\b(?=:)/g).filter(str => str !== ':' && str !== 'a')[0] : this.fallbackUnicodeEmoji
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
    readonly loading: Emoji;
    readonly check: Emoji;
  }

  let emojis: BotEmojis = {
    firstPage: new Emoji("⏪", "firstpage:791196460837765142"),
    lastPage: new Emoji("⏩", "lastpage:791196461303726140"),
    previousPage: new Emoji("◀️", "previouspage:791196461290487808"),
    nextPage: new Emoji("▶️", "nextpage:791196461177503764"),
    jumpPage: new Emoji("↗️", "jumppage:798157539296018462"),
    loading: new Emoji("⏲️", "a:loading:775590008354111549"),
    check: new Emoji("✅", "a:check_mark:775590009096372274")
  };

  export default emojis;
