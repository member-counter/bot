export const addTo = <T>(array: T[], item: T): T[] => {
  const newArray = [...array];
  newArray.push(item);
  return newArray;
};

export const updateIn = <T>(array: T[], item: T, index: number): T[] => {
  const newArray = [...array];
  newArray.splice(index, 1, item);
  return newArray;
};
export const removeFrom = <T>(array: T[], index: number): T[] => {
  const newArray = [...array];
  newArray.splice(index, 1);
  return newArray;
};
