import { db } from "@mc/db";

export type UserData = Awaited<ReturnType<typeof db.user.upsert>>;

export class UserSettings {
  private constructor(public data: UserData) {}
  public static async upsert(discordUserId: string, data?: Partial<UserData>) {
    const userData = await db.user.upsert({
      create: { discordUserId },
      where: { discordUserId },
      update: data ?? {},
    });
    return new UserSettings(userData);
  }
  public static async load(discordUserId: string) {
    const userData = await db.user.findUnique({
      where: { discordUserId },
    });

    if (!userData) return null;

    return new UserSettings(userData);
  }

  public static async loadById(id: string) {
    const userData = await db.user.findUniqueOrThrow({
      where: { id },
    });

    return new UserSettings(userData);
  }

  public static async delete(discordUserId: string) {
    await db.user.delete({
      where: { discordUserId },
    });
  }

  public async update(data?: Partial<UserData>) {
    const { data: newData } = await UserSettings.upsert(
      this.data.discordUserId,
      {
        ...this.data,
        ...data,
      },
    );

    this.data = newData;
    return this.data;
  }

  public async delete() {
    return await UserSettings.delete(this.data.discordUserId);
  }

  public async grantBadge(badge: bigint) {
    this.data.badges |= badge;
    await this.update();
    return this.data.badges;
  }

  public async revokeBadge(badge: bigint) {
    this.data.badges &= ~badge;
    await this.update();
    return this.data.badges;
  }
}
