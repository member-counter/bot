export const UserPermissions = {
  SeeUsers: 1 << 0,
  ManageUsers: 1 << 1,
  SeeGuilds: 1 << 2,
  ManageGuilds: 1 << 3,
} as const;
