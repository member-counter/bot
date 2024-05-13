import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { UserPermissions } from "@mc/common";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx: { db, authUser }, input }) => {
      const hasPermission =
        authUser.discordUserId === input.id ||
        new UserPermissions(authUser.permissions).has("SeeUsers");

      if (!hasPermission) throw new TRPCError({ code: "UNAUTHORIZED" });

      return db.user.findUnique({ where: { discordUserId: input.id } });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        discordUserId: z.string().optional(),
        badges: z.number().optional(),
        legacyPremiumBotUpgrades: z.number().optional(),
        credit: z.number().optional(),
        permissions: z.number().optional(),
      }),
    )
    .mutation(({ ctx: { db, authUser }, input }) => {
      const hasPermission = new UserPermissions(authUser.permissions).has(
        "ManageUsers",
      );

      if (!hasPermission) throw new TRPCError({ code: "UNAUTHORIZED" });

      return db.user.update({
        where: { discordUserId: input.id },
        data: input,
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx: { db, authUser }, input }) => {
      const hasPermission =
        authUser.discordUserId === input.id ||
        new UserPermissions(authUser.permissions).has("ManageUsers");

      if (!hasPermission) throw new TRPCError({ code: "UNAUTHORIZED" });

      return db.user.delete({
        where: { discordUserId: input.id },
      });
    }),
});
