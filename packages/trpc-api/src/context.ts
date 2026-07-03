import type { Session } from "@mc/validators/Session";

import { BitField } from "@mc/common/BitField";
import { db } from "@mc/db";
import { redis } from "@mc/redis";
import { UserSettingsService } from "@mc/services/userSettings";

/**
 * Creates the tRPC context.
 * This is framework-agnostic - session retrieval and refresh
 * should be handled by the framework-specific code before calling this.
 */
export const createTRPCContext = async (opts: { session: Session | null }) => {
  const authUser = opts.session?.userId
    ? await UserSettingsService.getOrCreate(opts.session.userId).then(
        (user) => ({
          ...user,
          permissions: new BitField(user.permissions),
        }),
      )
    : null;

  return {
    redis,
    db,
    session: opts.session,
    authUser,
  };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
