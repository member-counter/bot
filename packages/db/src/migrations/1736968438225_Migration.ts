import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

export class Migration1736968438225 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    // Guild Settings
    const guildsCollection = db.collection("guilds");
    await guildsCollection.updateMany({}, { $rename: { guild: "id" } });

    // User settings
    const usersCollection = db.collection("users");
    await usersCollection.updateMany({}, { $rename: { user: "id" } });
  }

  public down(_db: Db): Promise<void> {
    throw new Error("Unable to undo");
  }
}
