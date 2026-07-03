import { TRPCError } from "@trpc/server";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { z } from "zod";

import { BitField } from "@mc/common/BitField";
import { UserPermissions } from "@mc/common/UserPermissions";
import { botAPIConsumer } from "@mc/services/botAPI/botAPIConsumer";
import { DiscordService } from "@mc/services/discord";
import { GuildSettingsService } from "@mc/services/guildSettings";

import type { TRPCContext } from "../context";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Errors } from "../utils/errors";

async function checkUserPermissions(
  ctx: TRPCContext,
  input: { discordGuildId: string },
  check: (requiredPermissions: {
    userPermissions: BitField;
    userPermissionsInGuild: BitField;
  }) => boolean,
  { live = false }: { live?: boolean } = {},
) {
  if (!ctx.authUser || !ctx.session)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: Errors.NotAuthenticated,
    });

  const { discordGuildId } = input;
  const { accessToken } = ctx.session;
  const { discordUserId } = ctx.authUser;

  // The user's guild list already includes their permissions in each guild
  // and is served from a short-lived cache, unlike asking the bot fleet,
  // which costs a Redis round trip to another server plus a Discord API call.
  const fetchCachedPermissions = async () => {
    const { userGuilds } = await DiscordService.userGuilds(accessToken);
    return new BitField(userGuilds.get(discordGuildId)?.permissions);
  };

  const fetchLivePermissions = async () => {
    const member = await botAPIConsumer.discord.getGuildMember.query({
      guildId: discordGuildId,
      memberId: discordUserId,
    });

    return new BitField(member.permissions);
  };

  // Reads accept cached permissions, but mutations re-check live member
  // permissions so a demoted admin can't keep writing until the cache expires.
  const userPermissionsInGuild = live
    ? await fetchLivePermissions().catch(fetchCachedPermissions)
    : await fetchCachedPermissions().catch(() =>
        fetchLivePermissions().catch(() => new BitField(0n)),
      );

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

          await GuildSettingsService.channels.delete(discordChannelId);
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

          return await GuildSettingsService.channels.logs.get(discordChannelId);
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
