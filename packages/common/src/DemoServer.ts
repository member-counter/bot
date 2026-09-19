import type {
  DemoServerFeature as DemoServerFeatureDB,
  DemoServerPremiumTier as DemoServerPremiumTierDB,
} from "@mc/db";

// We can't import prisma code from the website due to nodejs imports, so we need to redo them here
export const DemoServerPremiumTier = {
  None: "None",
  Tier1: "Tier1",
  Tier2: "Tier2",
  Tier3: "Tier3",
} as const satisfies Record<
  DemoServerPremiumTierDB,
  DemoServerPremiumTierDB[keyof DemoServerPremiumTierDB]
>;
export type DemoServerPremiumTier =
  (typeof DemoServerPremiumTier)[keyof typeof DemoServerPremiumTier];

export const DemoServerFeature = {
  Verified: "Verified",
  Partnered: "Partnered",
  Community: "Community",
  Discoverable: "Discoverable",
} as const satisfies Record<
  DemoServerFeatureDB,
  DemoServerFeatureDB[keyof DemoServerFeatureDB]
>;
export type DemoServerFeature =
  (typeof DemoServerFeature)[keyof typeof DemoServerFeature];
