import { db } from "@mc/db";

export type DonationData = Awaited<ReturnType<typeof db.donation.update>>;

export const DonationsService = {
  getAll: async () => {
    return await db.donation.findMany({});
  },
};
