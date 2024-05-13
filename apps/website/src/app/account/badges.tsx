"use client";

import { BitField } from "@mc/common/BitField";
import { UserPermission } from "@mc/common/UserBadges";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mc/ui/tooltip";

const displayableBadges: Record<
  keyof typeof UserPermission,
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

  const badges = new BitField(unparsed);

  const badgesToDisplay = Object.entries(displayableBadges).filter(([badge]) =>
    badges.has(UserPermission[badge as keyof typeof UserPermission]),
  );

  return (
    <div className="text-1lg flex flex-row gap-2">
      {badgesToDisplay.map(([_badge, data]) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="select-none">{data.emoji}</div>
            </TooltipTrigger>
            <TooltipContent>
              <span>{data.description}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
