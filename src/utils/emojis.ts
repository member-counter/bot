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
	CUSTOM_EMOJI_ERROR,
	CUSTOM_EMOJI_WARNING,
	CUSTOM_EMOJI_CONFIRM,
	CUSTOM_EMOJI_NEGATIVE
} = getEnv();

class Emoji {
	private canUseExternalEmojis: boolean;
	private fallbackUnicodeEmoji: string;
	private customEmoji?: string;
	constructor(
		canUseExternalEmojis: boolean,
		fallbackUnicodeEmoji: string,
		customEmoji?: string
	) {
		this.canUseExternalEmojis = canUseExternalEmojis;
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
	get name(): string {
		return this.customEmoji && this.canUseExternalEmojis
			? this.customEmoji.match(/(\w*\b)(?=:)/g).filter((str) => str !== "a")[0]
			: this.fallbackUnicodeEmoji;
	}
	/**
	 * Use it in messages
	 */
	toString(): string {
		return this.customEmoji && this.canUseExternalEmojis
			? `<${this.customEmoji}>`
			: this.fallbackUnicodeEmoji;
	}

	/**
	 * Use it in reactions
	 */
	get reaction(): string {
		return this.customEmoji && this.canUseExternalEmojis
			? this.customEmoji
			: this.fallbackUnicodeEmoji;
	}
}

const Emojis = (canUseExternalEmojis: boolean) => {
	return {
		firstPage: new Emoji(canUseExternalEmojis, "⏪", CUSTOM_EMOJI_FIRST_PAGE),
		lastPage: new Emoji(canUseExternalEmojis, "⏩", CUSTOM_EMOJI_LAST_PAGE),
		previousPage: new Emoji(
			canUseExternalEmojis,
			"◀️",
			CUSTOM_EMOJI_PREVIOUS_PAGE
		),
		nextPage: new Emoji(canUseExternalEmojis, "▶️", CUSTOM_EMOJI_NEXT_PAGE),
		jump: new Emoji(canUseExternalEmojis, "↗️", CUSTOM_EMOJI_JUMP),
		loading: new Emoji(canUseExternalEmojis, "🕓", CUSTOM_EMOJI_LOADING),
		checkMark: new Emoji(canUseExternalEmojis, "✅", CUSTOM_EMOJI_CHECK_MARK),
		error: new Emoji(canUseExternalEmojis, "❌", CUSTOM_EMOJI_ERROR),
		confirm: new Emoji(canUseExternalEmojis, "✅", CUSTOM_EMOJI_CONFIRM),
		negative: new Emoji(canUseExternalEmojis, "❌", CUSTOM_EMOJI_NEGATIVE),
		warning: new Emoji(canUseExternalEmojis, "❌", CUSTOM_EMOJI_WARNING)
	} as const;
};

export default Emojis;
