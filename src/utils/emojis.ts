import getEnv from "./getEnv";

const {
	USE_CUSTOM_EMOJIS,
	CUSTOM_EMOJI_FIRST_PAGE,
	CUSTOM_EMOJI_LAST_PAGE,
	CUSTOM_EMOJI_PREVIOUS_PAGE,
	CUSTOM_EMOJI_NEXT_PAGE,
	CUSTOM_EMOJI_JUMP,
	CUSTOM_EMOJI_LOADING,
	CUSTOM_EMOJI_CHECK_MARK,
	CUSTOM_EMOJI_ERROR
} = getEnv();

class Emoji {
	public fallbackUnicodeEmoji: string;
	private customEmoji?: string;
	constructor(fallbackUnicodeEmoji: string, customEmoji?: string) {
		this.fallbackUnicodeEmoji = fallbackUnicodeEmoji;
		if (USE_CUSTOM_EMOJIS && customEmoji && !customEmoji.match(/^<a?:.+:\d+>$/))
			throw new Error(
				`The custom emoji "${customEmoji}" doesn't match the <:name:id> or <a:name:id> format, try to copy-paste it directly form discord by placing a backslash (\\) before the emoji`
			);
		this.customEmoji =
			USE_CUSTOM_EMOJIS && customEmoji
				? customEmoji.match(/^<(a?:.+:\d+)>$/)[1]
				: null;
	}
	/**
	 *  Get name for paginator collector
	 */
	name(canUseExternalEmojis?: boolean): string {
		return this.customEmoji && canUseExternalEmojis
			? this.customEmoji.match(/(\w*\b)(?=:)/g).filter((str) => str !== "a")[0]
			: this.fallbackUnicodeEmoji;
	}
	/**
	 * Use it in messages
	 */
	toString(canUseExternalEmojis?: boolean): string {
		return this.customEmoji && canUseExternalEmojis
			? `<${this.customEmoji}>`
			: this.fallbackUnicodeEmoji;
	}

	/**
	 * Use it in reactions
	 */
	reaction(canUseExternalEmojis?: boolean): string {
		return this.customEmoji && canUseExternalEmojis
			? this.customEmoji
			: this.fallbackUnicodeEmoji;
	}
}

const emojis = {
	firstPage: new Emoji("⏪", CUSTOM_EMOJI_FIRST_PAGE),
	lastPage: new Emoji("⏩", CUSTOM_EMOJI_LAST_PAGE),
	previousPage: new Emoji("◀️", CUSTOM_EMOJI_PREVIOUS_PAGE),
	nextPage: new Emoji("▶️", CUSTOM_EMOJI_NEXT_PAGE),
	jump: new Emoji("↗️", CUSTOM_EMOJI_JUMP),
	loading: new Emoji("🕓", CUSTOM_EMOJI_LOADING),
	checkMark: new Emoji("✅", CUSTOM_EMOJI_CHECK_MARK),
	error: new Emoji("❌", CUSTOM_EMOJI_ERROR)
} as const;

export default emojis;
