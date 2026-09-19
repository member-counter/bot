import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

export class Migration1783505855000 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    // User.prefersAutosave is required (Boolean @default(false)), which Prisma
    // only applies on create — so backfill existing documents, otherwise
    // reading a pre-existing user would fail on the missing field.
    const usersCollection = db.collection("users");
    await usersCollection.updateMany(
      { prefersAutosave: { $exists: false } },
      { $set: { prefersAutosave: false } },
    );
  }

  public down(_db: Db): Promise<void> {
    throw new Error("Unable to undo");
  }
}
