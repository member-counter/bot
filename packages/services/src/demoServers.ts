import { db } from "@mc/db";

import { throwNotFoundOrThrow } from "../../db/src/throwNotFoundOrThrow";

export type DemoServerData = Awaited<ReturnType<typeof db.demoServer.update>>;

export const DemoServersService = {
  create: async (data: { name: string; description: string }) => {
    return await db.demoServer.create({
      data,
    });
  },

  getAll: async () => {
    return (await db.demoServer.findMany()).sort(
      (a, b) => b.priority - a.priority,
    );
  },

  get: async (id: string) => {
    return await db.demoServer
      .findUniqueOrThrow({
        where: { id },
      })
      .catch(throwNotFoundOrThrow);
  },

  update: async (
    id: string,
    data: Parameters<typeof db.demoServer.update>[0]["data"],
  ) => {
    delete (data as unknown as { id?: string }).id;
    return await db.demoServer.update({
      where: { id: id },
      data: data,
    });
  },

  delete: async (id: string) => {
    await db.demoServer.delete({
      where: { id },
    });
  },
};
