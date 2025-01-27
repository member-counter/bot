// https://stackoverflow.com/a/64489535
export const groupBy = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => string,
) =>
  array.reduce(
    (acc, value, index, array) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      (acc[predicate(value, index, array)] ||= []).push(value);
      return acc;
    },
    {} as Record<string, T[]>,
  );
