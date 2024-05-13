import { BitField } from "discord.js";

const UserPermissionFlagsBits = {
  Donor: 1 << 0,
  Premium: 1 << 1,
  BetaTester: 1 << 2,
  Translator: 1 << 3,
  Contributor: 1 << 4,
  BigBrain: 1 << 5,
  BugCatcher: 1 << 6,
  PatPat: 1 << 7,
  FoldingAtHome: 1 << 8,
} as const;

export type UserBadgesString = keyof typeof UserPermissionFlagsBits;

export class UserBadges extends BitField<UserBadgesString, number> {
  static Flags = UserPermissionFlagsBits;
}
