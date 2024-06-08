import { db } from "@mc/db";

import { throwOrThrowNotFound } from "./throwOrThrowNotFound";

export type UserData = Awaited<ReturnType<typeof db.user.update>>;

export const UserSettings = {
  upsert: async (
    discordUserId: string,
    data?: Parameters<typeof db.user.upsert>[0]["update"],
  ) => {
    return await db.user.upsert({
      create: { discordUserId },
      where: { discordUserId },
      update: data ?? {},
    });
  },

  get: async (discordUserId: string) => {
    return await db.user
      .findUniqueOrThrow({
        where: { discordUserId },
      })
      .catch(throwOrThrowNotFound);
  },

  update: async (
    id: string,
    data: Parameters<typeof db.user.update>[0]["data"],
  ) => {
    delete (data as unknown as { id?: string }).id;
    return await db.user.update({
      where: { id: id },
      data: data,
    });
  },

  delete: async (discordUserId: string) => {
    await db.user.delete({
      where: { discordUserId },
    });
  },
};
