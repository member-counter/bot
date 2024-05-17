export const UserPermissions = {
  SeeUsers: 1n << 0n,
  ManageUsers: 1n << 1n,
  SeeGuilds: 1n << 2n,
  ManageGuilds: 1n << 3n,
} as const;
