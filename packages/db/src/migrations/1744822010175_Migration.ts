import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

export class Migration1744822010175 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    const guildsCollection = db.collection("guilds");

    // Ensure Guild.digits is not null
    await guildsCollection.updateMany(
      { digits: null },
      { $set: { digits: [] } },
    );
  }

  public down(_db: Db): Promise<void> {
    throw new Error("Unable to undo");
  }
}
