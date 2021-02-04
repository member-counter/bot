import getEnv from './getEnv'

const {
  USE_CUSTOM_EMOJIS,
  CUSTOM_EMOJI_FIRST_PAGE,
  CUSTOM_EMOJI_LAST_PAGE,
  CUSTOM_EMOJI_PREVIOUS_PAGE,
  CUSTOM_EMOJI_NEXT_PAGE,
  CUSTOM_EMOJI_JUMP,
  CUSTOM_EMOJI_LOADING,
  CUSTOM_EMOJI_CHECK_MARK
} = getEnv()

class Emoji {
  public fallbackUnicodeEmoji: string
  private customEmoji?: string
  constructor (fallbackUnicodeEmoji: string, customEmoji?: string) {
    this.fallbackUnicodeEmoji = fallbackUnicodeEmoji
    this.customEmoji = customEmoji
    if (customEmoji?.match(/^a?::.+:\d+/))
      throw new Error(
        'If custom emoji is present, it must be in :name:id or a:name:id format'
      )
  }
  /**
   *  Get name for paginator collector
   */
  get name (): string {
    return USE_CUSTOM_EMOJIS && this.customEmoji
      ? this.customEmoji.match(/(\w*\b)(?=:)/g).filter(str => str !== 'a')[0]
      : this.fallbackUnicodeEmoji
  }
  /**
   * Use it in messages
   */
  get string (): string {
    return USE_CUSTOM_EMOJIS && this.customEmoji
      ? `<${this.customEmoji}>`
      : this.fallbackUnicodeEmoji
  }

  /**
   * Use it in reactions
   */
  get reaction (): string {
    return USE_CUSTOM_EMOJIS && this.customEmoji
      ? this.customEmoji
      : this.fallbackUnicodeEmoji
  }
}

interface BotEmojis {
  readonly firstPage: Emoji
  readonly previousPage: Emoji
  readonly nextPage: Emoji
  readonly lastPage: Emoji
  readonly jump: Emoji
  readonly loading: Emoji
  readonly check_mark: Emoji
}

let emojis: BotEmojis = {
  firstPage: new Emoji('⏪', CUSTOM_EMOJI_FIRST_PAGE),
  lastPage: new Emoji('⏩', CUSTOM_EMOJI_LAST_PAGE),
  previousPage: new Emoji('◀️', CUSTOM_EMOJI_PREVIOUS_PAGE),
  nextPage: new Emoji('▶️', CUSTOM_EMOJI_NEXT_PAGE),
  jump: new Emoji('↗️', CUSTOM_EMOJI_JUMP),
  loading: new Emoji('⏲️', CUSTOM_EMOJI_LOADING),
  check_mark: new Emoji('✅', CUSTOM_EMOJI_CHECK_MARK)
}

export default emojis
