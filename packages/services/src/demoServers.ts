import type { DemoServer } from "@mc/db";

import { db } from "@mc/db";

import { throwNotFoundOrThrow } from "../../db/src/throwNotFoundOrThrow";
import { ProcessCache } from "./cache/ProcessCache";

export type DemoServerData = Awaited<ReturnType<typeof db.demoServer.update>>;

// The homepage reads the full demo server list. Keep it under one key.
const ALL_DEMO_SERVERS_KEY = "all";

// The TTL is only a safety limit. Writes invalidate the entry.
const demoServersCache = new ProcessCache<DemoServer[]>({
  name: "demoServers",
  ttlMs: 2 * 60 * 60 * 1000,
  maxEntries: 1,
});

const invalidateDemoServers = async () => {
  await demoServersCache.invalidate([ALL_DEMO_SERVERS_KEY]);
};

export const DemoServersService = {
  create: async (data: { name: string; description: string }) => {
    const created = await db.demoServer.create({
      data,
    });
    await invalidateDemoServers();
    return created;
  },

  getAll: async () => {
    const result = await demoServersCache.getMany(
      [ALL_DEMO_SERVERS_KEY],
      async () =>
        new Map([[ALL_DEMO_SERVERS_KEY, await db.demoServer.findMany()]]),
    );
    return result.get(ALL_DEMO_SERVERS_KEY) ?? [];
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
    const updated = await db.demoServer.update({
      where: { id: id },
      data: data,
    });
    await invalidateDemoServers();
    return updated;
  },

  delete: async (id: string) => {
    await db.demoServer.delete({
      where: { id },
    });
    await invalidateDemoServers();
  },
};
