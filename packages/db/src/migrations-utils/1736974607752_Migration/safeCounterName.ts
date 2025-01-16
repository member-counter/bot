export function safeCounterName(name: string) {
  return name.replace(/-|_|\s/g, "").toLowerCase();
}
