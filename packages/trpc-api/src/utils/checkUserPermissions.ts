import { TRPCError } from "@trpc/server";

import { BitField } from "@mc/common/BitField";
import { botAPIConsumer } from "@mc/services/botAPI/botAPIConsumer";
import { DiscordService } from "@mc/services/discord";

import type { TRPCContext } from "../context";
import { Errors } from "./errors";

/**
 * Throw UNAUTHORIZED when the user does not pass the check for the guild.
 * Every procedure that takes a guild id from the client must call it.
 */
export async function checkUserPermissions(
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
