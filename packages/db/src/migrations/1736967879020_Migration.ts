/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

const newCounters = [
  [/\{minecraft/gi, "{game:minecraft"],
  [/\{source/gi, "{game:css"],
  [/\{gta5-fivem/gi, "{game:fivem"],
  [/\{gtasa-mta/gi, "{game:mtasa"],
  [/\{gtasa-mp/gi, "{game:samp"],
];

export class Migration1736967879020 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    // Guild Settings
    const guildsCollection = db.collection("guilds");

    const guildsCursor = guildsCollection.find();

    while (await guildsCursor.hasNext()) {
      const settings: any = await guildsCursor.next();

      if ("counters" in settings) {
        for (const id of Object.keys(
          settings.counters as Record<string, unknown>,
        )) {
          for (const [oldCounter, newCounter] of newCounters) {
            settings.counters[id] = settings.counters[id].replace(
              oldCounter,
              newCounter,
            );
          }
        }
      }

      delete settings._id;
      delete settings.__v;

      await guildsCollection.findOneAndUpdate(
        { guild: settings.guild },
        { $set: settings },
      );
    }
  }

  public down(_db: Db): Promise<void> {
    throw new Error("Unable to undo");
  }
}
