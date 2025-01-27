/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

export class Migration1736968354466 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    // Guild Settings
    const guildsCollection = db.collection("guilds");

    const guildsCursor = guildsCollection.find();

    while (await guildsCursor.hasNext()) {
      const guildSettings: any = await guildsCursor.next();
      const { counters } = guildSettings;

      for (const id in counters) {
        if (Object.hasOwnProperty.call(counters, id)) {
          counters[id] = counters[id].replace(
            /\{https?:(.+?)\}/gi,
            (wholeMatch: any, url: string) => {
              try {
                // Test if migration was already applied
                JSON.parse(Buffer.from(url, "base64").toString("utf-8"));

                return `{http:${url}}`;
              } catch {
                return `{http:${Buffer.from(
                  JSON.stringify({ url, parseNumber: true }),
                  "utf-8",
                ).toString("base64")}}`;
              }
            },
          );

          counters[id] = counters[id].replace(
            /\{https?-string:(.+?)\}/gi,
            (wholeMatch: any, url: string) => {
              try {
                // Test if migration was already applied
                JSON.parse(Buffer.from(url, "base64").toString("utf-8"));

                return `{http:${url}}`;
              } catch {
                return `{http:${Buffer.from(
                  JSON.stringify({ url }),
                  "utf-8",
                ).toString("base64")}}`;
              }
            },
          );
        }
      }

      const { _id } = guildSettings;
      delete guildSettings._id;
      delete guildSettings.__v;

      await guildsCollection.findOneAndUpdate({ _id }, { $set: guildSettings });
    }
  }

  public down(_db: Db): Promise<void> {
    throw new Error("Unable to undo");
  }
}
