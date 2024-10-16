import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { DemoServers } from "@mc/common/DemoServers";
import { UserPermissions } from "@mc/common/UserPermissions";

import { Errors } from "~/app/errors";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const demoServersRouter = createTRPCRouter({
  geAll: publicProcedure.query(async () => {
    return await DemoServers.getAll();
  }),
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await DemoServers.get(input.id);
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().default("New server"),
        description: z.string().default(""),
      }),
    )
    .mutation(async ({ ctx: { authUser }, input }) => {
      const hasPermission = authUser.permissions.has(
        UserPermissions.ManageHomePage,
      );

      if (!hasPermission)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });

      return await DemoServers.create(input);
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        icon: z.string().nullable(),
        priority: z.number().optional(),
        channels: z
          .array(
            z.object({
              name: z.string(),
              type: z.number(),
              topic: z.string().nullable(),
              showAsSkeleton: z.boolean(),
            }),
          )
          .optional(),
        links: z
          .array(
            z.object({
              href: z.string(),
              label: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx: { authUser }, input }) => {
      const hasPermission = authUser.permissions.has(
        UserPermissions.ManageHomePage,
      );

      if (!hasPermission)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });

      return DemoServers.update(input.id, input);
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx: { authUser }, input }) => {
      const hasPermission = authUser.permissions.has(
        UserPermissions.ManageHomePage,
      );

      if (!hasPermission)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });

      await DemoServers.delete(input.id);
    }),
});
