import { db } from "@mc/db";

export const DatabaseService = {
  // Close the DB connection. Call this only during process shutdown.
  disconnect: async () => {
    await db.$disconnect();
  },
};
