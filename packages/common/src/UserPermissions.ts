export const UserPermissions = {
  SeeUsers: 1n << 0n,
  ManageUsers: 1n << 1n,
  SeeGuilds: 1n << 2n,
  ManageGuilds: 1n << 3n,
  ManageHomePage: 1n << 4n,
  ManageDonations: 1n << 5n,
} as const;
