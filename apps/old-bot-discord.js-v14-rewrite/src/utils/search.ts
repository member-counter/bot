/**
 * @param {string[]} texts to search
 * @param {string} text to search in the texts
 * @returns {number[]} ordered from higher to lower, the index of the texts of the best  matching results
 */
export function searchInTexts(texts: string[], text: string): number[] {
	const plain = (string: string): string[] => {
		return string
			.trim()
			.normalize("NFD")
			.toLowerCase()
			.replace(/\p{Diacritic}/gu, "")
			.split(/\s+|\n+/);
	};
	const keywords = plain(text);
	const plainTexts = texts.map((t) => plain(t));

	type IndexOfTexts = number;
	type Score = number;
	const result = new Map<IndexOfTexts, Score>();

	plainTexts.forEach((words, IndexOfText) => {
		words.forEach((word) => {
			keywords.forEach((keyword) => {
				if (word.startsWith(keyword) || keyword.startsWith(word)) {
					let score = result.get(IndexOfText) ?? 0;
					score++;
					result.set(IndexOfText, score);
				}
			});
		});
	});

	return Array.from(result)
		.sort(([, score], [, score2]) => score - score2)
		.map(([index]) => index);
}

export default searchInTexts;
