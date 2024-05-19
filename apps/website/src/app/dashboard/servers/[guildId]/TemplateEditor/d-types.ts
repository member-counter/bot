import type { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "~/server/api/root";

export type Guild = inferRouterOutputs<AppRouter>["discord"]["getGuild"];

export type GuildEmoji = NonNullable<ReturnType<Guild["emojis"]["get"]>>;

export type GuildChannel = NonNullable<ReturnType<Guild["channels"]["get"]>>;

export type GuildRole = NonNullable<ReturnType<Guild["roles"]["get"]>>;
