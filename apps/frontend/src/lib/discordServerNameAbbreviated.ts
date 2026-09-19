export function discordServerNameAbbreviated(name: string) {
  return name
    .split(/\s+/g)
    .map((x) => x[0])
    .join("");
}
