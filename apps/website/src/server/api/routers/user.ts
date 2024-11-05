import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { UserPermissions } from "@mc/common/UserPermissions";
import { UserSettingsService } from "@mc/services/userSettings";

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

      return await UserSettingsService.get(input.discordUserId);
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

      return UserSettingsService.update(input.id, input);
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

      await UserSettingsService.delete(input.discordUserId);
    }),
});
