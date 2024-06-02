export const UserBadges = [
  "Donor",
  "Premium",
  "BetaTester",
  "Translator",
  "Contributor",
  "BigBrain",
  "BugCatcher",
  "PatPat",
  "FoldingAtHome",
] as const;

export const UserBadgesBitfield: Record<(typeof UserBadges)[number], bigint> = {
  Donor: 1n << 0n,
  Premium: 1n << 1n,
  BetaTester: 1n << 2n,
  Translator: 1n << 3n,
  Contributor: 1n << 4n,
  BigBrain: 1n << 5n,
  BugCatcher: 1n << 6n,
  PatPat: 1n << 7n,
  FoldingAtHome: 1n << 8n,
} as const;

export const UserBadgesEmoji: Record<(typeof UserBadges)[number], string> = {
  Donor: "❤️",
  Premium: "💎",
  BetaTester: "🧪",
  Translator: "🌎",
  Contributor: "💻",
  BigBrain: "🧠",
  BugCatcher: "🐛",
  PatPat: "🐱",
  FoldingAtHome: "🧬",
} as const;
