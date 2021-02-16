/**
 * Splits the string in the nearest linebreak to the 2000th character, useful for emebed descriptions
 * @param str The content of the embed
 */
const safeDiscordString = (str: string): string[] => {
	const splited = str.split("\n");
	let result: string[] = [];

	splited.forEach((portion) => {
		const workingIndex = result.length - 1;
		if (
			result.length > 0 &&
			portion.length + result[workingIndex].length < 2000 - "\n".length
		) {
			result[workingIndex] = `${result[workingIndex]}\n${portion}`;
		} else {
			result.push(`${portion}\n`);
		}
	});

	return result;
};

export default safeDiscordString;
