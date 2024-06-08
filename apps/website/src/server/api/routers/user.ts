import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { UserPermissions } from "@mc/common/UserPermissions";
import { UserSettings } from "@mc/common/UserSettings";

import { Errors } from "~/app/errors";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ discordUserId: z.string() }))
    .query(async ({ ctx: { authUser }, input }) => {
      const hasPermission =
        authUser.discordUserId === input.discordUserId ||
        authUser.permissions.has(UserPermissions.SeeUsers);

      if (!hasPermission)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });

      return await UserSettings.get(input.discordUserId);
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
    .mutation(async ({ ctx: { authUser }, input }) => {
      const hasPermission = authUser.permissions.has(
        UserPermissions.ManageUsers,
      );

      if (!hasPermission)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });

      return UserSettings.update(input.id, input);
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

      await UserSettings.delete(input.discordUserId);
    }),
});
