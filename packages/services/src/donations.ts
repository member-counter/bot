import { db } from "@mc/db";

export type DonationData = Awaited<ReturnType<typeof db.donation.update>>;
export type CreateDonationData = Parameters<
  typeof db.donation.create
>[0]["data"];
export type UpdateDonationData = Parameters<
  typeof db.donation.update
>[0]["data"];

export const DonationsService = {
  get: async (id: string) => {
    return await db.donation.findUniqueOrThrow({
      where: { id },
    });
  },

  getAll: async (returnAnonymous: boolean) => {
    return await db.donation.findMany({
      where: { anonymous: returnAnonymous ? undefined : false },
    });
  },

  getAllDonors: async (returnAnonymous: boolean) => {
    return await db.user.findMany({
      where: {
        donations: { some: { anonymous: returnAnonymous ? undefined : false } },
      },
      include: {
        donations: true,
      },
    });
  },

  register: async (donation: CreateDonationData) => {
    return await db.donation.create({
      data: donation,
    });
  },

  update: async (id: string, donation: UpdateDonationData) => {
    delete (donation as unknown as { id?: string }).id;

    return await db.donation.update({
      where: { id },
      data: donation,
    });
  },

  delete: async (id: string) => {
    return await db.donation.delete({
      where: { id },
    });
  },
};
