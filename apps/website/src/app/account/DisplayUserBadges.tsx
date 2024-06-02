"use client";

import { BitField } from "@mc/common/BitField";
import {
  UserBadges,
  UserBadgesBitfield,
  UserBadgesEmoji,
} from "@mc/common/UserBadges";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mc/ui/tooltip";

const UserBadgesDescription: Record<(typeof UserBadges)[number], string> = {
  Donor:
    "You donated to support the development and maintenance of Member Counter",
  Premium: "You are a premium user",
  BetaTester: "You participated in a beta program",
  Translator: "You helped to translate the bot",
  Contributor: "You implemented a feature or fixed a bug",
  BigBrain: "You suggested an idea and it was implemented",
  BugCatcher: "You found and reported a bug",
  PatPat: "You found a secret",
  FoldingAtHome: "You contributed a WU in folding@home",
} as const;

export function DisplayUserBadges({ badges: unparsed }: { badges: bigint }) {
  if (unparsed === 0n) return;

  const badges = new BitField(unparsed);

  const badgesToDisplay: {
    badge: (typeof UserBadges)[number];
    emoji: string;
    description: string;
  }[] = UserBadges.filter((badge) => badges.has(UserBadgesBitfield[badge])).map(
    (badge) => ({
      badge,
      emoji: UserBadgesEmoji[badge],
      description: UserBadgesDescription[badge],
    }),
  );

  return (
    <div className="text-md flex flex-row gap-2">
      {badgesToDisplay.map(({ badge, emoji, description }) => (
        <TooltipProvider key={badge}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="select-none">{emoji}</div>
            </TooltipTrigger>
            <TooltipContent>
              <span>{description}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
