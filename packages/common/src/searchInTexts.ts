/**
 * @param {string[]} texts to search
 * @param {string} text to search in the texts
 * @returns {number[]} ordered from higher to lower, the index of the texts of the best matching results
 */
export function searchInTexts(texts: string[][], text: string): number[] {
  const normalize = (strings: string[]): string[] => {
    return strings.map((string) =>
      string
        .trim()
        .normalize("NFD")
        .toLowerCase()
        .replace(/\p{Diacritic}/gu, ""),
    );
  };

  const searchableText = normalize(text.split(/\s+|\n+/));
  const plainTexts = texts.map((t) => normalize(t));

  type IndexOfTexts = number;
  type Score = number;
  const result = new Map<IndexOfTexts, Score>();

  plainTexts.forEach((words, IndexOfText) => {
    words.forEach((word) => {
      searchableText.forEach((keyword) => {
        if (
          word.length &&
          (word.startsWith(keyword) || keyword.startsWith(word))
        ) {
          let score = result.get(IndexOfText) ?? 0;
          score++;
          result.set(IndexOfText, score);
        }
      });
    });
  });

  return Array.from(result)
    .sort(([_index, score], [_index2, score2]) => score - score2)
    .map(([index]) => index);
}

export default searchInTexts;
