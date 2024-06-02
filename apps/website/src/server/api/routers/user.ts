import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { User } from "@mc/common/User";
import { UserPermissions } from "@mc/common/UserPermissions";

import { Errors } from "~/app/errors";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ discordUserId: z.string() }))
    .query(({ ctx: { authUser }, input }) => {
      const hasPermission =
        authUser.discordUserId === input.discordUserId ||
        authUser.permissions.has(UserPermissions.SeeUsers);

      if (!hasPermission)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });

      return User.load(input.discordUserId);
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        discordUserId: z.string().optional(),
        badges: z.bigint().optional(),
        permissions: z.bigint().optional(),
      }),
    )
    .mutation(({ ctx: { db, authUser }, input }) => {
      const hasPermission = authUser.permissions.has(
        UserPermissions.ManageUsers,
      );

      if (!hasPermission)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });

      return db.user.update({
        where: { id: input.id },
        data: {
          discordUserId: input.discordUserId,
          badges: input.badges,
          permissions: input.permissions,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        discordUserId: z.string(),
      }),
    )
    .mutation(async ({ ctx: { authUser }, input }) => {
      const hasPermission =
        authUser.discordUserId === input.discordUserId ||
        authUser.permissions.has(UserPermissions.ManageUsers);

      if (!hasPermission)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });

      await User.remove(input.discordUserId);
    }),
});
