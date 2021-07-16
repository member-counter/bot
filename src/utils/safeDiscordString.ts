/**
 * Splits the string in the nearest linebreak to the 2000th character, useful for emebed descriptions
 * @param str The content of the embed
 */
const safeDiscordString = (str: string, chars = 2000): string[] => {
	const splited = str.split("\n");
	let result: string[] = [];

	for (let portion of splited) {
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
