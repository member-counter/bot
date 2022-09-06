import twemoji from "twemoji";

export function twemojiURL(emoji: string): string {
	return `${twemoji.base}72x72/${twemoji.convert.toCodePoint(emoji)}.png`;
}
