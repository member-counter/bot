import { TRPCError } from "@trpc/server";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { z } from "zod";

import { BitField } from "@mc/common/BitField";
import { UserPermissions } from "@mc/common/UserPermissions";

import { Errors } from "~/app/errors";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createCaller } from "../root";

async function getAuthUserGuildPermissions(
  caller: ReturnType<typeof createCaller>,
  guildId: string,
  memberId: string,
) {
  const permissions = await caller.discord
    .getGuildMember({ guildId, memberId })
    .then((member) => member.permissions)
    .catch(async () => {
      const { userGuilds } = await caller.discord.userGuilds();

      const guild = userGuilds.get(guildId);

      return guild?.permissions;
    });

  return new BitField(BigInt(permissions ?? "0"));
}

export const guildRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ discordGuildId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userPermissions = ctx.authUser.permissions;
      const userGuildpermissions = await getAuthUserGuildPermissions(
        createCaller(ctx),
        input.discordGuildId,
        ctx.authUser.discordUserId,
      );

      const hasPermission =
        userPermissions.has(UserPermissions.SeeGuilds) ||
        userGuildpermissions.any(
          PermissionFlagsBits.Administrator |
            PermissionFlagsBits.ManageChannels,
        );

      if (!hasPermission)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });

      return await ctx.db.guild.findUnique({
        where: { discordGuildId: input.discordGuildId },
      });
    }),

  has: protectedProcedure
    .input(z.object({ discordGuildId: z.string() }))
    .query(async ({ ctx, input }) => {
      return !!(await ctx.db.guild.findUnique({
        where: { discordGuildId: input.discordGuildId },
        select: { id: true },
      }));
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        discordGuildId: z.string(),
        formatSettings: z
          .object({
            locale: z.string().optional(),
            compactNotation: z.boolean().optional(),
            digits: z.array(z.string()).min(10).max(10).optional(),
          })
          .optional(),
        blocked: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userPermissions = ctx.authUser.permissions;
      const userGuildpermissions = await getAuthUserGuildPermissions(
        createCaller(ctx),
        input.discordGuildId,
        ctx.authUser.discordUserId,
      );

      const hasPermission =
        userPermissions.has(UserPermissions.ManageGuilds) ||
        userGuildpermissions.any(
          PermissionFlagsBits.Administrator |
            PermissionFlagsBits.ManageChannels,
        );

      if (!hasPermission)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });

      const hasPermissionToBlock = userPermissions.has(
        UserPermissions.ManageGuilds,
      );

      if (!hasPermissionToBlock && "blocked" in input)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });

      return ctx.db.guild.update({
        where: { discordGuildId: input.discordGuildId },
        data: { formatSettings: input.formatSettings },
      });
    }),

  reset: protectedProcedure
    .input(
      z.object({
        discordGuildId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userPermissions = ctx.authUser.permissions;
      const userGuildpermissions = await getAuthUserGuildPermissions(
        createCaller(ctx),
        input.discordGuildId,
        ctx.authUser.discordUserId,
      );

      const hasPermission =
        userPermissions.has(UserPermissions.ManageGuilds) ||
        userGuildpermissions.any(PermissionFlagsBits.Administrator);

      if (!hasPermission)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });

      await ctx.db.guild.delete({
        where: { discordGuildId: input.discordGuildId },
      });

      await ctx.db.guild.create({
        data: { discordGuildId: input.discordGuildId, formatSettings: {} },
      });
    }),

  isBlocked: protectedProcedure
    .input(
      z.object({
        discordGuildId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userPermissions = ctx.authUser.permissions;
      const userGuildpermissions = await getAuthUserGuildPermissions(
        createCaller(ctx),
        input.discordGuildId,
        ctx.authUser.discordUserId,
      );

      const hasPermission =
        userPermissions.has(UserPermissions.SeeGuilds) ||
        userGuildpermissions.any(
          PermissionFlagsBits.Administrator |
            PermissionFlagsBits.ManageChannels,
        );

      if (!hasPermission)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });

      return await ctx.db.blockedGuild.findUnique({
        where: { discordGuildId: input.discordGuildId },
      });
    }),

  updateBlockState: protectedProcedure
    .input(
      z.object({
        discordGuildId: z.string(),
        state: z.boolean(),
        reason: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userPermissions = ctx.authUser.permissions;

      const hasPermission = userPermissions.has(UserPermissions.ManageGuilds);

      if (!hasPermission)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });

      if (input.state) {
        await ctx.db.blockedGuild.create({
          data: {
            discordGuildId: input.discordGuildId,
            reason: input.reason ?? "",
          },
        });
      } else {
        await ctx.db.blockedGuild.delete({
          where: { discordGuildId: input.discordGuildId },
        });
      }
    }),
});
