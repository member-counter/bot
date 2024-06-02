import twemoji from "twemoji";

export function twemojiURL(emoji: string): string {
	return `https://twemoji.maxcdn.com/v/14.0.2/72x72/${twemoji.convert.toCodePoint(
		emoji
	)}.png`;
}
