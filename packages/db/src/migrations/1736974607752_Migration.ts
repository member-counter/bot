import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";
import { ObjectId } from "mongodb";
import { z } from "zod";

const oldUserSchemaValidator = z.object({
  _id: z.string(),
  id: z.string(),
  badges: z.number().default(0),
});

const oldDonationSchemaValidator = z.object({
  _id: z.string(),
  user: z.string(),
  note: z.string().optional().default(""),
  anonymous: z.boolean().optional().default(false),
  amount: z.number(),
  currency: z.string(),
  date: z.date(),
});

export class Migration1736974607752 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    // Users
    const newUsersCollection = db.collection("User");
    const oldUsersCollection = db.collection("users");
    const oldUsersCursor = oldUsersCollection.find();

    while (await oldUsersCursor.hasNext()) {
      const oldUserUnknown = await oldUsersCursor.next();
      const oldUser = oldUserSchemaValidator.parse(oldUserUnknown);

      await newUsersCollection.insertOne({
        _id: new ObjectId(oldUser._id),
        discordUserId: oldUser.id,
        badges: oldUser.badges,
        permissions: 0,
      });
    }

    await oldUsersCollection.drop();

    // Donations
    const newDonationsCollection = db.collection("Donation");
    const oldDonationsCollection = db.collection("donations");
    const oldDonationsCursor = oldDonationsCollection.find();

    while (await oldDonationsCursor.hasNext()) {
      const oldDonationUnknown = await oldDonationsCursor.next();
      const oldDonation = oldDonationSchemaValidator.parse(oldDonationUnknown);

      await newDonationsCollection.insertOne({
        _id: new ObjectId(oldDonation._id),
        note: oldDonation.note,
        anonymous: oldDonation.anonymous,
        date: oldDonation.date,
        amount: BigInt(Math.floor(oldDonation.amount * 100)),
        currency: oldDonation.currency,
        currencyDecimals: 2,
        userId: oldDonation.user,
      });
    }

    await oldDonationsCollection.drop();
  }

  public down(_db: Db): Promise<void> {
    throw new Error("Unable to undo");
  }
}
