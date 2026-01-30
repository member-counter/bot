export function addTimezoneOffset(date: Date | number) {
  if (typeof date !== "number") date = date.getTime();

  return new Date(date + new Date().getTimezoneOffset() * 60 * 1000);
}
export function subTimezoneOffset(date: Date | number) {
  if (typeof date !== "number") date = date.getTime();

  return new Date(date - new Date().getTimezoneOffset() * 60 * 1000);
}
