/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

export class Migration1736968509876 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    // Guild Settings
    const guildsCollection = db.collection("guilds");

    const guildsCursor = guildsCollection.find();

    while (await guildsCursor.hasNext()) {
      const guildSettings: any = await guildsCursor.next();
      const { guild, counters } = guildSettings;

      for (const id in counters) {
        if (Object.hasOwnProperty.call(counters, id)) {
          counters[id] = counters[id].replace(
            /\{substract?:(.+?)\}/gi,
            (wholeMatch: any, data: any) => {
              return `{subtract:${data}}`;
            },
          );
        }
      }

      delete guildSettings._id;
      delete guildSettings.__v;

      await guildsCollection.findOneAndUpdate(
        { guild: guild },
        { $set: guildSettings },
      );
    }
  }

  public down(_db: Db): Promise<void> {
    throw new Error("Unable to undo");
  }
}
