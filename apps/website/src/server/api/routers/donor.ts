import assert from "assert";
import type { DiscordUser } from "@mc/validators/DiscordUser";
import type { DefaultUserAvatarAssets } from "discord-api-types/v10";
import { TRPCError } from "@trpc/server";
import { CDNRoutes, RouteBases } from "discord-api-types/v10";
import { z } from "zod";

import { CurrencyUtils } from "@mc/common/currencyUtils";
import { UserPermissions } from "@mc/common/UserPermissions";
import { botDataExchangeConsumer } from "@mc/services/botDataExchange/botDataExchangeConsumer";
import { DonationsService } from "@mc/services/donations";

import { Errors } from "~/app/errors";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
  // TODO set value to EUR change rate
  geAllDonors: publicProcedure.query(async ({ ctx: { authUser } }) => {
    const returnAnonymous = !!authUser?.permissions.has(
      UserPermissions.ManageDonations,
    );

    const rawDonors = await DonationsService.getAllDonors(returnAnonymous);
    const donors = new Map(Object.entries(rawDonors));

    const discordUsers = await fetchUsers([...donors.keys()]);

    return discordUsers.map((user) => {
      const donations = donors.get(user.id);
      assert(donations);

      return {
        user,
        donations: donations.map((donation) => ({
          ...donation,
          value: CurrencyUtils.toNumber(
            donation.amount,
            donation.currencyDecimals,
          ),
        })),
      };
    });
  }),

  geAllDonations: publicProcedure.query(async ({ ctx: { authUser } }) => {
    const returnAnonymous = !!authUser?.permissions.has(
      UserPermissions.ManageDonations,
    );
    const rawDonations = await DonationsService.getAll(returnAnonymous);

    const donors = new Set(rawDonations.map((donation) => donation.userId));

    const discordUsers = await fetchUsers([...donors.keys()]);
    const mappedDiscordUsers = new Map(
      discordUsers.map((user) => [user.id, user]),
    );

    return rawDonations.map((donation) => ({
      user: mappedDiscordUsers.get(donation.userId),
      ...donation,
      value: donation.amount,
    }));
  }),

  registerDonation: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        note: z.string(),
        anonymous: z.boolean(),
        date: z.date(),
        amount: z.bigint(),
        currency: z.string(),
        currencyDecimals: z.number(),
      }),
    )
    .mutation(async ({ ctx: { authUser }, input }) => {
      const hasPermission = authUser.permissions.has(
        UserPermissions.ManageDonations,
      );

      if (!hasPermission) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });
      }

      return await DonationsService.register(input);
    }),

  getDonation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx: { authUser }, input }) => {
      const hasPermission = authUser.permissions.has(
        UserPermissions.ManageDonations,
      );

      if (!hasPermission) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });
      }

      return await DonationsService.get(input.id);
    }),

  updateDonation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string().optional(),
        note: z.string().optional(),
        anonymous: z.boolean().optional(),
        date: z.date().optional(),
        amount: z.bigint().optional(),
        currency: z.string().optional(),
        currencyDecimals: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx: { authUser }, input }) => {
      const hasPermission = authUser.permissions.has(
        UserPermissions.ManageDonations,
      );

      if (!hasPermission) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });
      }

      return await DonationsService.update(input.id, input);
    }),

  deleteDonation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx: { authUser }, input }) => {
      const hasPermission = authUser.permissions.has(
        UserPermissions.ManageDonations,
      );

      if (!hasPermission) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: Errors.NotAuthorized,
        });
      }

      return await DonationsService.delete(input.id);
    }),
});
