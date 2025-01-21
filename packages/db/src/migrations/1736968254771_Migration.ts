/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

export class Migration1736968254771 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    // Guild Settings
    const guildsCollection = db.collection("guilds");
    const guildsCursor = guildsCollection.find();

    while (await guildsCursor.hasNext()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const settings: any = await guildsCursor.next();

      if ("shortNumber" in settings) {
        if (settings.shortNumber) {
          settings.shortNumber = 1;
        } else {
          settings.shortNumber = -1;
        }
      }

      const { _id } = settings;
      delete settings._id;
      delete settings.__v;

      await guildsCollection.findOneAndUpdate({ _id }, { $set: settings });
    }
  }

  public down(_db: Db): Promise<void> {
    throw new Error("Unable to undo");
  }
}
