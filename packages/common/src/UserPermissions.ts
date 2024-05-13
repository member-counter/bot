import { BitField } from "discord.js";

const UserPermissionsFlagsBits = {
  SeeUsers: 1 << 0,
  ManageUsers: 1 << 1,
  SeeGuilds: 1 << 2,
  ManageGuilds: 1 << 3,
} as const;

export type UserPermissionsString = keyof typeof UserPermissionsFlagsBits;

export class UserPermissions extends BitField<UserPermissionsString, number> {
  static Flags = UserPermissionsFlagsBits;
}
