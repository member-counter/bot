import config from "../config";

const {
	customEmojis: {
		useCustomEmojis,
		checkMark,
		error,
		confirm,
		negative,
		warning,
		loading
	}
} = config;

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
		if (useCustomEmojis && customEmoji && !customEmoji.match(/^<a?:.+:\d+>$/))
			throw new Error(
				`The custom emoji "${customEmoji}" doesn't match the <:name:id> or <a:name:id> format, try to copy-paste it directly form discord by placing a backslash (\\) before the emoji`
			);
		this.customEmoji =
			useCustomEmojis && customEmoji
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
		loading: new Emoji(canUseExternalEmojis, "🕓", loading),
		checkMark: new Emoji(canUseExternalEmojis, "✅", checkMark),
		error: new Emoji(canUseExternalEmojis, "❌", error),
		confirm: new Emoji(canUseExternalEmojis, "✅", confirm),
		negative: new Emoji(canUseExternalEmojis, "❌", negative),
		warning: new Emoji(canUseExternalEmojis, "⚠️", warning)
	} as const;
};

export default Emojis;
