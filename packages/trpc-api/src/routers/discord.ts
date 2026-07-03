import { TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import { z } from "zod";

import { cachedFetch } from "@mc/common/redis/cachedFetch";
import { discordGuildCacheKey } from "@mc/common/redis/keys";
import { botAPIConsumer } from "@mc/services/botAPI/botAPIConsumer";
import { DiscordService } from "@mc/services/discord";
import { REQUEST_TIMEOUT_MESSAGE } from "@mc/trpc-redis/Constants";

import { createTRPCRouter, protectedProcedure } from "../trpc";
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
      return botAPIConsumer.discord.getUser.query({ id });
    }),
  getGuild: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input: { id } }) => {
      return cachedFetch({
        redis: ctx.redis,
        key: discordGuildCacheKey(id),
        ttlSeconds: GUILD_CACHE_TTL,
        fetch: () =>
          botAPIConsumer.discord.getGuild
            .query({ id })
            .catch(notFoundOnTimeout),
        validate: (raw) => raw as BotGuild,
        // the snapshot holds Maps, which plain JSON can't round-trip
        stringify: (raw) => SuperJSON.stringify(raw),
        parse: (cached) => SuperJSON.parse(cached),
      });
    }),

  getGuildMember: protectedProcedure
    .input(z.object({ guildId: z.string(), memberId: z.string() }))
    .query(({ input: { guildId, memberId } }) => {
      return botAPIConsumer.discord.getGuildMember
        .query({ guildId, memberId })
        .catch(notFoundOnTimeout);
    }),
});
