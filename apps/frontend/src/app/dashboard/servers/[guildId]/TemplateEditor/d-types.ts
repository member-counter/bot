import type { AppRouter } from "@mc/trpc-api/root";
import type { inferRouterOutputs } from "@trpc/server";

export type Guild = inferRouterOutputs<AppRouter>["discord"]["getGuild"];

export type GuildEmoji = NonNullable<ReturnType<Guild["emojis"]["get"]>>;

export type GuildChannel = NonNullable<ReturnType<Guild["channels"]["get"]>>;

export type GuildRole = NonNullable<ReturnType<Guild["roles"]["get"]>>;
