import { TRPCError } from "@trpc/server";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { z } from "zod";

import { BitField } from "@mc/common/BitField";
import { getChannelLogs } from "@mc/common/redis/ChannelLogs";
import { UserPermissions } from "@mc/common/UserPermissions";

import type { createTRPCContext } from "~/server/api/trpc";
import { Errors } from "~/app/errors";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createCaller } from "../root";

async function checkUserPermissions(
  ctx: Awaited<ReturnType<typeof createTRPCContext>>,
  input: { discordGuildId: string },
  check: (perms: {
    userPermissions: BitField;
    userPermissionsInGuild: BitField;
  }) => boolean,
) {
  if (!ctx.authUser)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: Errors.NotAuthenticated,
    });

  const caller = createCaller(ctx);
  const { discordGuildId } = input;

  const userPermissionsInGuild = await caller.discord
    .getGuildMember({
      guildId: discordGuildId,
      memberId: ctx.authUser.discordUserId,
    })
    .then((member) => new BitField(member.permissions))
    .catch(async () => {
      const { userGuilds } = await caller.discord.userGuilds();

      const guild = userGuilds.get(discordGuildId);

      return new BitField(guild?.permissions);
    });

  const hasPermission = check({
    userPermissions: ctx.authUser.permissions,
    userPermissionsInGuild,
  });

  if (!hasPermission) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: Errors.NotAuthorized,
    });
  }
}

export const guildRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ discordGuildId: z.string() }))
    .query(async ({ ctx, input }) => {
      await checkUserPermissions(
        ctx,
        input,
        ({ userPermissions, userPermissionsInGuild }) =>
          userPermissions.has(UserPermissions.SeeGuilds) ||
          userPermissionsInGuild.any(
            PermissionFlagsBits.Administrator |
              PermissionFlagsBits.ManageChannels,
          ),
      );

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
        discordGuildId: z.string(),
        formatSettings: z
          .object({
            locale: z.string().optional(),
            compactNotation: z.boolean().optional(),
            digits: z.array(z.string()).min(10).max(10).optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkUserPermissions(
        ctx,
        input,
        ({ userPermissions, userPermissionsInGuild }) =>
          userPermissions.has(UserPermissions.ManageGuilds) ||
          userPermissionsInGuild.any(
            PermissionFlagsBits.Administrator |
              PermissionFlagsBits.ManageChannels,
          ),
      );

      return ctx.db.guild.update({
        where: { discordGuildId: input.discordGuildId },
        data: { formatSettings: input.formatSettings },
        include: { channels: true },
      });
    }),

  reset: protectedProcedure
    .input(
      z.object({
        discordGuildId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkUserPermissions(
        ctx,
        input,
        ({ userPermissions, userPermissionsInGuild }) =>
          userPermissions.has(UserPermissions.ManageGuilds) ||
          userPermissionsInGuild.any(PermissionFlagsBits.Administrator),
      );

      await ctx.db.guild.delete({
        where: { discordGuildId: input.discordGuildId },
        include: { channels: true },
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
      await checkUserPermissions(
        ctx,
        input,
        ({ userPermissions, userPermissionsInGuild }) =>
          userPermissions.has(UserPermissions.SeeGuilds) ||
          userPermissionsInGuild.any(
            PermissionFlagsBits.Administrator |
              PermissionFlagsBits.ManageChannels,
          ),
      );

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
      await checkUserPermissions(ctx, input, ({ userPermissions }) =>
        userPermissions.has(UserPermissions.ManageGuilds),
      );

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

  channels: createTRPCRouter({
    get: protectedProcedure
      .input(
        z.object({ discordChannelId: z.string(), discordGuildId: z.string() }),
      )
      .query(async ({ ctx, input: { discordChannelId, discordGuildId } }) => {
        await checkUserPermissions(
          ctx,
          { discordGuildId },
          ({ userPermissions, userPermissionsInGuild }) =>
            userPermissions.has(UserPermissions.SeeGuilds) ||
            userPermissionsInGuild.any(
              PermissionFlagsBits.Administrator |
                PermissionFlagsBits.ManageChannels,
            ),
        );

        return await ctx.db.channel.upsert({
          create: { discordChannelId, discordGuildId },
          update: {},
          where: { discordChannelId, discordGuildId },
        });
      }),

    getAll: protectedProcedure
      .input(z.object({ discordGuildId: z.string() }))
      .query(async ({ ctx, input: { discordGuildId } }) => {
        await checkUserPermissions(
          ctx,
          { discordGuildId },
          ({ userPermissions, userPermissionsInGuild }) =>
            userPermissions.has(UserPermissions.SeeGuilds) ||
            userPermissionsInGuild.any(
              PermissionFlagsBits.Administrator |
                PermissionFlagsBits.ManageChannels,
            ),
        );

        return await ctx.db.channel
          .findMany({
            where: { discordGuildId },
          })
          .then((channels) => ({
            channels: new Map(
              channels.map((channel) => [channel.discordChannelId, channel]),
            ),
          }));
      }),

    update: protectedProcedure
      .input(
        z.object({
          discordChannelId: z.string(),
          discordGuildId: z.string(),
          template: z.string().optional(),
          isTemplateEnabled: z.boolean().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        await checkUserPermissions(
          ctx,
          input,
          ({ userPermissions, userPermissionsInGuild }) =>
            userPermissions.has(UserPermissions.ManageGuilds) ||
            userPermissionsInGuild.any(
              PermissionFlagsBits.Administrator |
                PermissionFlagsBits.ManageChannels,
            ),
        );

        const { discordChannelId, discordGuildId } = input;

        return await ctx.db.channel.upsert({
          create: input,
          update: input,
          where: { discordChannelId, discordGuildId },
        });
      }),

    delete: protectedProcedure
      .input(
        z.object({
          discordChannelId: z.string(),
          discordGuildId: z.string(),
        }),
      )
      .mutation(
        async ({ ctx, input: { discordChannelId, discordGuildId } }) => {
          await checkUserPermissions(
            ctx,
            { discordGuildId },
            ({ userPermissions, userPermissionsInGuild }) =>
              userPermissions.has(UserPermissions.ManageGuilds) ||
              userPermissionsInGuild.any(PermissionFlagsBits.Administrator),
          );

          await ctx.db.channel.delete({
            where: { discordChannelId },
          });
        },
      ),

    getLogs: protectedProcedure
      .input(
        z.object({ discordChannelId: z.string(), discordGuildId: z.string() }),
      )
      .query(async ({ ctx, input: { discordChannelId, discordGuildId } }) => {
        await checkUserPermissions(
          ctx,
          { discordGuildId },
          ({ userPermissions, userPermissionsInGuild }) =>
            userPermissions.has(UserPermissions.SeeGuilds) ||
            userPermissionsInGuild.any(
              PermissionFlagsBits.Administrator |
                PermissionFlagsBits.ManageChannels,
            ),
        );

        return await getChannelLogs(ctx.redis, discordChannelId);
      }),

    getAllLogs: protectedProcedure
      .input(z.object({ discordGuildId: z.string() }))
      .query(async ({ ctx, input: { discordGuildId } }) => {
        await checkUserPermissions(
          ctx,
          { discordGuildId },
          ({ userPermissions, userPermissionsInGuild }) =>
            userPermissions.has(UserPermissions.SeeGuilds) ||
            userPermissionsInGuild.any(
              PermissionFlagsBits.Administrator |
                PermissionFlagsBits.ManageChannels,
            ),
        );

        const { channels } = await ctx.db.guild.findUniqueOrThrow({
          where: { discordGuildId },
          select: { channels: { select: { discordChannelId: true } } },
        });

        const channelLogs = await Promise.all(
          channels.map(async ({ discordChannelId }) => ({
            discordChannelId,
            logs: await getChannelLogs(ctx.redis, discordChannelId),
          })),
        );

        const channelLogsMap = new Map(
          channelLogs.map(({ discordChannelId, logs }) => [
            discordChannelId,
            logs,
          ]),
        );

        return { channelLogs: channelLogsMap };
      }),
  }),
});
