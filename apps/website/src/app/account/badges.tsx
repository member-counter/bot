import type { UserBadgesString } from "@mc/common";

import { UserBadges } from "@mc/common";

import { InfoToolip } from "~/app/components/InfoTooltip";

const displayableBadges: Record<
  UserBadgesString,
  { emoji: string; description: string }
> = {
  Donor: {
    emoji: "❤️",
    description:
      "You donated to support the development and maintenance of Member Counter",
  },
  Premium: { emoji: "💎", description: "You are a premium user" },
  BetaTester: {
    emoji: "🧪",
    description: "You participated in a beta program",
  },
  Translator: {
    emoji: "🌎",
    description: "You helped to translate the bot",
  },
  Contributor: {
    emoji: "💻",
    description: "You implemented a feature or fixed a bug",
  },
  BigBrain: {
    emoji: "🧠",
    description: "You suggested an idea and it was implemented",
  },
  BugCatcher: { emoji: "🐛", description: "You found and reported a bug" },
  PatPat: { emoji: "🐱", description: "You found a secret" },
  FoldingAtHome: {
    emoji: "🧬",
    description: "You contributed a WU in folding@home",
  },
} as const;

export function DisplayUserBadges({ badges: unparsed }: { badges: number }) {
  if (unparsed === 0) return;

  const badges = new UserBadges(unparsed);
  

  const badgesToDisplay = Object.entries(displayableBadges)
  .filter(([badge]) => badges.has(badge as UserBadgesString));

  return (
    <div className="text-1lg gap-2">
      {badgesToDisplay.map(([badge, data]) => (
          <InfoToolip text={data.description} key={badge}>
            {data.emoji}
          </InfoToolip>
        ))}
    </div>
  );
}
