import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { UserPermissions } from "@mc/common/UserPermissions";
import { UserSettingsService } from "@mc/services/userSettings";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Errors } from "../utils/errors";

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
        prefersAutosave: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx: { authUser }, input }) => {
      const { id, ...fields } = input;

      // Fields only an admin (ManageUsers) may change. Anything not listed here
      // (e.g. prefersAutosave) a user may change on their own account.
      const privilegedFields = [
        "discordUserId",
        "badges",
        "permissions",
      ] as const;
      const editsPrivilegedField = privilegedFields.some(
        (field) => fields[field] !== undefined,
      );
      const editsAnotherUser = authUser.id !== id;

      if (
        (editsPrivilegedField || editsAnotherUser) &&
        !authUser.permissions.has(UserPermissions.ManageUsers)
      )
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });

      return UserSettingsService.update(id, fields);
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
