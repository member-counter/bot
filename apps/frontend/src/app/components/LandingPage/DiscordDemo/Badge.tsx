import React, { useId } from "react";

import { DiscordBrandingColors } from "@mc/common/Constants";
import {
  DemoServerFeature,
  DemoServerPremiumTier,
} from "@mc/common/DemoServer";

import { BadgeBackFlower } from "./assets/BadgeBackFlower";
import { Community } from "./assets/Community";
import { Discoverable } from "./assets/Discoverable";
import { Partnered } from "./assets/Partnered";
import { PremiumTier1 } from "./assets/PremiumTier1";
import { PremiumTier2 } from "./assets/PremiumTier2";
import { PremiumTier3 } from "./assets/PremiumTier3";
import { Verified } from "./assets/Verified";

export const Badge = ({
  premiumTier,
  features,
}: {
  premiumTier: DemoServerPremiumTier;
  features: DemoServerFeature[];
}) => {
  const premiumGradientId = useId();

  const fillColors = {
    grey: "#96979f",
    darkGrey: "#50505a",
    white: "#ffffff",
    verified: "#3d9e60",
    partnered: `#${DiscordBrandingColors.Blurple.toString(16)}`,
    premium: `url(#${premiumGradientId})`,
  } as const;

  const badges: {
    IconComponent: React.FC<{ fill: string; size: string }>;
    flowerFill: string;
    iconFill: string;
    iconSize: string;
    doMatch: (
      features: DemoServerFeature[],
      premiumTier: DemoServerPremiumTier,
    ) => boolean;
  }[] = [
    {
      IconComponent: Verified,
      flowerFill: fillColors.verified,
      iconFill: fillColors.white,
      iconSize: "13px",
      doMatch: (features) => features.includes(DemoServerFeature.Verified),
    },
    {
      IconComponent: Partnered,
      flowerFill: fillColors.partnered,
      iconFill: fillColors.white,
      iconSize: "13px",
      doMatch: (features) => features.includes(DemoServerFeature.Partnered),
    },
    {
      IconComponent: Discoverable,
      flowerFill:
        premiumTier === DemoServerPremiumTier.None
          ? fillColors.white
          : fillColors.premium,
      iconFill:
        premiumTier === DemoServerPremiumTier.None
          ? fillColors.darkGrey
          : fillColors.white,
      iconSize: "10px",
      doMatch: (features) => features.includes(DemoServerFeature.Discoverable),
    },
    {
      IconComponent: Community,
      flowerFill:
        premiumTier === DemoServerPremiumTier.None
          ? fillColors.white
          : fillColors.premium,
      iconFill:
        premiumTier === DemoServerPremiumTier.None
          ? fillColors.darkGrey
          : fillColors.white,
      iconSize: "10px",
      doMatch: (features) => features.includes(DemoServerFeature.Community),
    },
    {
      IconComponent: PremiumTier1,
      flowerFill: fillColors.white,
      iconFill: fillColors.darkGrey,
      iconSize: "10px",
      doMatch: (_features, premiumTier) =>
        premiumTier === DemoServerPremiumTier.Tier1,
    },
    {
      IconComponent: PremiumTier2,
      flowerFill: fillColors.white,
      iconFill: fillColors.darkGrey,
      iconSize: "10px",
      doMatch: (_features, premiumTier) =>
        premiumTier === DemoServerPremiumTier.Tier2,
    },
    {
      IconComponent: PremiumTier3,
      flowerFill: fillColors.white,
      iconFill: fillColors.darkGrey,
      iconSize: "10px",
      doMatch: (_features, premiumTier) =>
        premiumTier === DemoServerPremiumTier.Tier3,
    },
  ];

  const badgeConfig = badges.find((badge) =>
    badge.doMatch(features, premiumTier),
  );

  if (!badgeConfig) {
    return null;
  }

  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <linearGradient id={premiumGradientId} gradientTransform="rotate(45)">
          <stop offset="0" stop-color="#ff73f5"></stop>
          <stop offset="1" stop-color="#e292aa"></stop>
        </linearGradient>
      </svg>
      <div className="relative mr-2 flex h-[18px] w-[18px] items-center justify-center [&>svg]:h-full [&>svg]:w-full">
        <BadgeBackFlower fill={badgeConfig.flowerFill} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <badgeConfig.IconComponent
            size={badgeConfig.iconSize}
            fill={badgeConfig.iconFill}
          />
        </div>
      </div>
    </>
  );
};
