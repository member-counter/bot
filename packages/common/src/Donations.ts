import { db } from "@mc/db";

export type DonationData = Awaited<ReturnType<typeof db.donation.update>>;

export const Donations = {
  getAll: async () => {
    return await db.donation.findMany({});
  },
};
