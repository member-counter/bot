import type { BitField } from "@mc/common/BitField";
import { TRPCError } from "@trpc/server";
import { PermissionFlagsBits } from "discord-api-types/v10";
import SuperJSON from "superjson";
import { z } from "zod";

import { cachedFetch } from "@mc/common/redis/cachedFetch";
import { discordGuildCacheKey } from "@mc/common/redis/keys";
import { UserPermissions } from "@mc/common/UserPermissions";
import { botAPIConsumer } from "@mc/services/botAPI/botAPIConsumer";
import { DiscordService } from "@mc/services/discord";
import { REQUEST_TIMEOUT_MESSAGE } from "@mc/trpc-redis/Constants";

import type { TRPCContext } from "../context";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { checkUserPermissions } from "../utils/checkUserPermissions";
import { handleUnauthorizedDiscordError } from "../utils/discordErrors";
import { Errors } from "../utils/errors";

type BotGuild = Awaited<
  ReturnType<(typeof botAPIConsumer)["discord"]["getGuild"]["query"]>
>;

// The snapshot ships every channel, role and emoji of a guild across the
// Redis bus, so avoid rebuilding it on every dashboard query. Kept short:
// the frontend refetches on window focus to pick up channel/role changes
// made in Discord.
const GUILD_CACHE_TTL = 15; // seconds

// No bot instance answering in time is the authoritative "no bot serves this
// guild" signal; NOT_FOUND tells the client to show the invite state and not
// to retry.
const notFoundOnTimeout = (error: unknown): never => {
  if (error instanceof Error && error.message === REQUEST_TIMEOUT_MESSAGE)
    throw new TRPCError({ code: "NOT_FOUND", message: Errors.NotFound });
  throw error;
};

// The guild snapshot holds the names of all channels and roles, private ones
// included. Use the same check as reading the channel settings of the guild.
const canReadGuild = ({
  userPermissions,
  userPermissionsInGuild,
}: {
  userPermissions: BitField;
  userPermissionsInGuild: BitField;
}) =>
  userPermissions.has(UserPermissions.SeeGuilds) ||
  userPermissionsInGuild.any(
    PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageChannels,
  );

// Callers must check the access of the user before they call this function.
// The snapshot is cached for all users of the guild.
const fetchGuildSnapshot = (redis: TRPCContext["redis"], id: string) =>
  cachedFetch({
    redis,
    key: discordGuildCacheKey(id),
    ttlSeconds: GUILD_CACHE_TTL,
    fetch: () =>
      botAPIConsumer.discord.getGuild.query({ id }).catch(notFoundOnTimeout),
    validate: (raw) => raw as BotGuild,
    // the snapshot holds Maps, which plain JSON can't round-trip
    stringify: (raw) => SuperJSON.stringify(raw),
    parse: (cached) => SuperJSON.parse(cached),
  });

export const discordRouter = createTRPCRouter({
  identify: protectedProcedure.query(({ ctx }) => {
    return DiscordService.identify(ctx.session.accessToken).catch(
      handleUnauthorizedDiscordError,
    );
  }),
  userGuilds: protectedProcedure.query(({ ctx }) => {
    return DiscordService.userGuilds(ctx.session.accessToken).catch(
      handleUnauthorizedDiscordError,
    );
  }),
  getUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input: { id } }) => {
      return DiscordService.getUser(id);
    }),
  getGuild: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      await checkUserPermissions(ctx, { discordGuildId: id }, canReadGuild);

      return fetchGuildSnapshot(ctx.redis, id);
    }),

  getGuildEmojis: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      // Each member of a guild can see its emojis in Discord. Membership is
      // sufficient here, and no other part of the snapshot is returned.
      const { userGuilds } = await DiscordService.userGuilds(
        ctx.session.accessToken,
      ).catch(handleUnauthorizedDiscordError);

      if (!userGuilds.has(id))
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });

      const guild = await fetchGuildSnapshot(ctx.redis, id);

      return { id: guild.id, name: guild.name, emojis: guild.emojis };
    }),

  getGuildMember: protectedProcedure
    .input(z.object({ guildId: z.string(), memberId: z.string() }))
    .query(async ({ ctx, input: { guildId, memberId } }) => {
      // A user can read their own member data. Reading other members needs
      // access to the guild.
      if (memberId !== ctx.authUser.discordUserId)
        await checkUserPermissions(
          ctx,
          { discordGuildId: guildId },
          canReadGuild,
        );

      return botAPIConsumer.discord.getGuildMember
        .query({ guildId, memberId })
        .catch(notFoundOnTimeout);
    }),
});
