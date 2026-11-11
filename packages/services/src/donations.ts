import type { Donation } from "@mc/db";

import { groupBy } from "@mc/common/groupBy";
import { db } from "@mc/db";

import { ProcessCache } from "./cache/ProcessCache";

export type DonationData = Awaited<ReturnType<typeof db.donation.update>>;
export type CreateDonationData = Parameters<
  typeof db.donation.create
>[0]["data"];
export type UpdateDonationData = Parameters<
  typeof db.donation.update
>[0]["data"];

// The public pages read the full donation list. Keep it under one key.
const ALL_DONATIONS_KEY = "all";

// The TTL is only a safety limit. Writes invalidate the entry.
const donationsCache = new ProcessCache<Donation[]>({
  name: "donations",
  ttlMs: 2 * 60 * 60 * 1000,
  maxEntries: 1,
});

const getAllDonations = async () => {
  const result = await donationsCache.getMany(
    [ALL_DONATIONS_KEY],
    async () => new Map([[ALL_DONATIONS_KEY, await db.donation.findMany()]]),
  );
  return result.get(ALL_DONATIONS_KEY) ?? [];
};

/** Remove the cached donations. Call it after a write to the donation rows. */
export const invalidateDonations = async () => {
  await donationsCache.invalidate([ALL_DONATIONS_KEY]);
};

export const DonationsService = {
  get: async (id: string) => {
    return await db.donation.findUniqueOrThrow({
      where: { id },
    });
  },

  getAll: async (returnAnonymous: boolean) => {
    const donations = await getAllDonations();
    return returnAnonymous
      ? donations
      : donations.filter((donation) => !donation.anonymous);
  },

  getAllDonors: async (returnAnonymous: boolean) => {
    const donations = await DonationsService.getAll(returnAnonymous);
    return groupBy(donations, (donation) => donation.userId);
  },

  register: async (donation: CreateDonationData) => {
    const created = await db.donation.create({
      data: donation,
    });
    await invalidateDonations();
    return created;
  },

  update: async (id: string, donation: UpdateDonationData) => {
    delete (donation as unknown as { id?: string }).id;

    const updated = await db.donation.update({
      where: { id },
      data: donation,
    });
    await invalidateDonations();
    return updated;
  },

  delete: async (id: string) => {
    const deleted = await db.donation.delete({
      where: { id },
    });
    await invalidateDonations();
    return deleted;
  },
};
