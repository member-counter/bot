import { PermissionFlagsBits } from "discord-api-types/v10";
import { z } from "zod";

import { UserPermissions } from "@mc/common/UserPermissions";
import { GuildSettingsService } from "@mc/services/guildSettings";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { checkUserPermissions } from "../utils/checkUserPermissions";

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

      return await GuildSettingsService.get(input.discordGuildId);
    }),

  has: protectedProcedure
    .input(z.object({ discordGuildId: z.string() }))
    .query(async ({ input }) => {
      return await GuildSettingsService.has(input.discordGuildId);
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
        { live: true },
      );

      return await GuildSettingsService.upsert(input.discordGuildId, {
        formatSettings: input.formatSettings,
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
        { live: true },
      );

      await GuildSettingsService.reset(input.discordGuildId);
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

      return await GuildSettingsService.isBlocked(input.discordGuildId);
    }),

  updateBlockState: protectedProcedure
    .input(
      z.object({
        discordGuildId: z.string(),
        state: z.boolean(),
        reason: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input: { discordGuildId, state, reason } }) => {
      await checkUserPermissions(
        ctx,
        { discordGuildId },
        ({ userPermissions }) =>
          userPermissions.has(UserPermissions.ManageGuilds),
      );

      await GuildSettingsService.updateBlock(discordGuildId, state, reason);
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

        return await GuildSettingsService.channels.get(
          discordChannelId,
          discordGuildId,
        );
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

        return {
          channels: new Map(
            (await GuildSettingsService.channels.getAll(discordGuildId)).map(
              (channel) => [channel.discordChannelId, channel],
            ),
          ),
        };
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
          { live: true },
        );

        return await GuildSettingsService.channels.update(input);
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
            { live: true },
          );

          await GuildSettingsService.channels.delete(
            discordChannelId,
            discordGuildId,
          );
        },
      ),

    logs: createTRPCRouter({
      get: protectedProcedure
        .input(
          z.object({
            discordChannelId: z.string(),
            discordGuildId: z.string(),
          }),
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

          return await GuildSettingsService.channels.logs.get(
            discordChannelId,
            discordGuildId,
          );
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

          return {
            channelLogs:
              await GuildSettingsService.channels.logs.getAll(discordGuildId),
          };
        }),
    }),
  }),
});
