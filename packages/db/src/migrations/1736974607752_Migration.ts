import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";
import { ObjectId } from "mongodb";
import { z } from "zod";

import { convert } from "../migrations-utils/1736974607752_Migration/transpiler";

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

const oldGuildSettingsSchema = z.object({
  _id: z.string(),
  id: z.string(),
  premium: z.boolean().default(false),
  language: z.string().default("en-US"),
  counters: z.record(z.string(), z.string()).default({}),
  shortNumber: z.number().default(1),
  locale: z.string().default("disabled"),
  digits: z
    .array(z.string())
    .default(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]),
  blocked: z.boolean().default(false),
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

    // Guilds
    const oldGuildsCollection = db.collection("guilds");
    const newGuildsCollection = db.collection("Guild");
    const blockedGuildsCollection = db.collection("BlockedGuild");
    const channelsCollection = db.collection("Channel");

    const oldGuildsCursor = oldGuildsCollection.find();

    while (await oldGuildsCursor.hasNext()) {
      const oldGuildUnknown = await oldGuildsCursor.next();
      const oldGuild = oldGuildSettingsSchema.parse(oldGuildUnknown);

      // Transform Guild
      const newGuild = {
        _id: new ObjectId(oldGuild._id),
        discordGuildId: oldGuild.id,
        language: oldGuild.language,
        formatSettings: {
          locale: oldGuild.locale === "disabled" ? "en-US" : oldGuild.locale,
          compactNotation: oldGuild.shortNumber === 1,
          digits: oldGuild.digits,
        },
      };

      await newGuildsCollection.insertOne(newGuild);

      // Handle blocked guilds
      if (oldGuild.blocked) {
        await blockedGuildsCollection.insertOne({
          discordGuildId: oldGuild.id,
          reason: "",
        });
      }

      // Handle channels
      for (const [channelId, template] of Object.entries(oldGuild.counters)) {
        await channelsCollection.insertOne({
          discordChannelId: channelId,
          template: convert(template),
          isTemplateEnabled: Boolean(template),
          discordGuildId: oldGuild.id,
        });
      }
    }

    // Drop the old collection
    await oldGuildsCollection.drop();
  }

  public down(_db: Db): Promise<void> {
    throw new Error("Unable to undo");
  }
}
