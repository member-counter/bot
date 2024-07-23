"use client";

import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

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

const getUserBadgesDescription = (t: TFunction) => ({
  Donor: t("pages.account.userBadges.donor"),
  Premium: t("pages.account.userBadges.premium"),
  BetaTester: t("pages.account.userBadges.betaTester"),
  Translator: t("pages.account.userBadges.translator"),
  Contributor: t("pages.account.userBadges.contributor"),
  BigBrain: t("pages.account.userBadges.bigBrain"),
  BugCatcher: t("pages.account.userBadges.bugCatcher"),
  PatPat: t("pages.account.userBadges.patPat"),
  FoldingAtHome: t("pages.account.userBadges.foldingAtHome"),
});

export function DisplayUserBadges({ badges: unparsed }: { badges: bigint }) {
  const { t } = useTranslation();

  if (unparsed === 0n) return;

  const badges = new BitField(unparsed);
  const userBadgesDescription = getUserBadgesDescription(t);

  const badgesToDisplay: {
    badge: (typeof UserBadges)[number];
    emoji: string;
    description: string;
  }[] = UserBadges.filter((badge) => badges.has(UserBadgesBitfield[badge])).map(
    (badge) => ({
      badge,
      emoji: UserBadgesEmoji[badge],
      description: userBadgesDescription[badge],
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
