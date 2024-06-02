/**
 * Splits the string in the nearest line break to the 2000th character, useful for embed descriptions
 * @param str The content of the embed
 */
const safeDiscordString = (str: string, chars = 2000): string[] => {
	const splitted = str.split("\n");
	const result: string[] = [];

	for (const portion of splitted) {
		const last = result.length - 1;

		if (result[last] && (result[last] + portion).length < chars) {
			result[last] = result[last] + "\n" + portion;
		} else {
			result.push(portion);
		}
	}
	return result;
};

export default safeDiscordString;
