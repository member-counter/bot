import type { DiscordUser } from "@mc/validators/DiscordUser";
import type { DiscordUserGuilds } from "@mc/validators/DiscordUserGuilds";
import { REST } from "@discordjs/rest";
import { OAuth2Routes, Routes } from "discord-api-types/v10";

import { DiscordUserSchema } from "@mc/validators/DiscordUser";
import { DiscordUserGuildsSchema } from "@mc/validators/DiscordUserGuilds";

function createClient(token: string) {
  return new REST({
    version: "10",
    authPrefix: "Bearer",
  }).setToken(token);
}

export async function identify(token: string): Promise<DiscordUser> {
  const client = createClient(token);

  const user = await client.get(Routes.user());

  return DiscordUserSchema.parse(user);
}

export async function userGuilds(token: string): Promise<DiscordUserGuilds> {
  const client = createClient(token);

  const guilds = await client.get(Routes.userGuilds(), {
    query: new URLSearchParams({ with_counts: "true" }),
  });

  return DiscordUserGuildsSchema.parse(guilds);
}
