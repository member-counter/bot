import type { DonationData } from "@mc/services/donations";
import type { DiscordUser } from "@mc/validators/DiscordUser";
import type { DefaultUserAvatarAssets } from "discord-api-types/v10";
import { CDNRoutes, RouteBases } from "discord-api-types/v10";

import { botDataExchangeConsumer } from "@mc/services/botDataExchange/botDataExchangeConsumer";
import { DonationsService } from "@mc/services/donations";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

function fetchUsers(users: string[]): Promise<DiscordUser[]> {
  return Promise.all(
    users.map((id) =>
      botDataExchangeConsumer.discord.getUser.query({ id }).catch(
        () =>
          ({
            id,
            username: "Unknown",
            discriminator: "0",
            avatar:
              RouteBases.cdn +
              CDNRoutes.defaultUserAvatar(
                Number((BigInt(id) >> 22n) % 6n) as DefaultUserAvatarAssets,
              ),
          }) as DiscordUser,
      ),
    ),
  );
}

export const donorRouter = createTRPCRouter({
  geAll: publicProcedure.query(async () => {
    const donations = await DonationsService.getAll();
    const donationsGroupedByUsers = new Map<string, DonationData[]>(
      donations.map((donation) => [donation.user, []]),
    );
    for (const donation of donations) {
      donationsGroupedByUsers.get(donation.user)?.push(donation);
    }

    const discordUsers = await fetchUsers([...donationsGroupedByUsers.keys()]);

    return [
      ...discordUsers.map((user) => ({
        user,
        donations: donationsGroupedByUsers.get(user.id) ?? [],
      })),
    ];
  }),
});
