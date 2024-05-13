import type { PermissionsBitField } from "discord.js";
import { RouteBases, Routes } from "discord-api-types/v10";

interface GenerateLinkOptions {
  clientId: string;
  permissions: PermissionsBitField;
  selectedGuild?: string;
}

export function generateInviteLink({
  clientId,
  permissions,
  selectedGuild,
}: GenerateLinkOptions) {
  const inviteLink = new URL(
    `${RouteBases.api}${Routes.oauth2Authorization()}`,
  );

  inviteLink.searchParams.set("client_id", clientId);
  inviteLink.searchParams.set("permissions", permissions.bitfield.toString());
  inviteLink.searchParams.set("scope", "bot");

  if (selectedGuild) inviteLink.searchParams.set("guild_id", selectedGuild);

  return inviteLink.toString();
}
