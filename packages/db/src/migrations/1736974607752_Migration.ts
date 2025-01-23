import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

import { convert } from "../migrations-utils/1736974607752_Migration/counter-transpiler/transpiler";
import {
  oldDonationSchemaValidator,
  oldGuildSettingsSchema,
} from "../migrations-utils/1736974607752_Migration/oldSchemas";

export class Migration1736974607752 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    // Users
    const usersCollection = db.collection("users");

    await usersCollection.findOneAndDelete({ id: { $eq: null } });

    await usersCollection.updateMany(
      {},
      {
        $rename: {
          id: "discordUserId",
        },
      },
    );

    await usersCollection.updateMany({}, [
      {
        $set: {
          badges: {
            $cond: [{ $eq: ["$badges", Infinity] }, 999999999999, "$badges"],
          },
        },
      },
      {
        $set: {
          badges: { $toLong: ["$badges"] },
        },
      },
    ]);

    await usersCollection.rename("User").catch(() => void 0);

    // Donations
    const newDonationsCollection = db.collection("Donation");
    const oldDonationsCollection = db.collection("donations");
    const oldDonationsCursor = oldDonationsCollection.find();

    while (await oldDonationsCursor.hasNext()) {
      const oldDonationUnknown = await oldDonationsCursor.next();
      const oldDonation = oldDonationSchemaValidator.parse(oldDonationUnknown);

      await newDonationsCollection.insertOne({
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
        discordGuildId: oldGuild.id,
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

    // Guild member count cache
    await db.dropCollection("guildcountcaches");

    // Guild logs
    await db.dropCollection("guildlogs");

    // Motds
    await db.dropCollection("motds");
  }

  public down(_db: Db): Promise<void> {
    throw new Error("Unable to undo");
  }
}
