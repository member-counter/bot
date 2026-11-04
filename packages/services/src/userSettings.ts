import type { User } from "@mc/db";

import { db, NotFoundError } from "@mc/db";

import { ProcessCache } from "./cache/ProcessCache";
import { invalidateDonations } from "./donations";

export type UserData = Awaited<ReturnType<typeof db.user.update>>;

// Key: discordUserId. Value: null when the user has no settings row.
// The TTL is only a safety limit. Writes in this file invalidate the entries.
const userCache = new ProcessCache<User | null>({
  name: "user",
  ttlMs: 2 * 60 * 60 * 1000,
  maxEntries: 100_000,
});

const loadUsers = async (discordUserIds: string[]) => {
  const rows = await db.user.findMany({
    where: { discordUserId: { in: discordUserIds } },
  });
  const result = new Map<string, User | null>(
    discordUserIds.map((id) => [id, null]),
  );
  rows.forEach((row) => result.set(row.discordUserId, row));
  return result;
};

const getCachedUser = async (discordUserId: string) => {
  const result = await userCache.getMany([discordUserId], loadUsers);
  return result.get(discordUserId) ?? null;
};

export const UserSettingsService = {
  upsert: async (
    discordUserId: string,
    data?: Parameters<typeof db.user.upsert>[0]["update"],
  ) => {
    // Without data, an upsert changes nothing on an existing row. Read it
    // from the cache, and do not send an invalidation.
    if (!data) return await UserSettingsService.getOrCreate(discordUserId);

    const user = await db.user.upsert({
      create: { discordUserId },
      where: { discordUserId },
      update: data,
    });
    await userCache.invalidate([discordUserId]);
    return user;
  },

  get: async (discordUserId: string) => {
    const user = await getCachedUser(discordUserId);
    if (!user) throw new NotFoundError();
    return user;
  },

  getOrCreate: async (discordUserId: string) => {
    const user = await getCachedUser(discordUserId);
    if (user) return user;

    const created = await db.user.upsert({
      create: { discordUserId },
      where: { discordUserId },
      update: {},
    });
    await userCache.invalidate([discordUserId]);
    return created;
  },

  update: async (
    id: string,
    data: Parameters<typeof db.user.update>[0]["data"],
  ) => {
    delete (data as unknown as { id?: string }).id;
    const user = await db.user.update({
      where: { id: id },
      data: data,
    });
    await userCache.invalidate([user.discordUserId]);
    return user;
  },

  delete: async (discordUserId: string) => {
    await db.user.delete({
      where: { discordUserId },
    });
    // The delete also removes the donations of the user (cascade).
    await Promise.all([
      userCache.invalidate([discordUserId]),
      invalidateDonations(),
    ]);
  },
};
