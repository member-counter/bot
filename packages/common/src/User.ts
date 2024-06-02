import { db } from "@mc/db";

export type UserData = Awaited<ReturnType<typeof db.user.upsert>>;

export class User {
  private constructor(public data: UserData) {}
  public static async upsert(discordUserId: string, data?: Partial<UserData>) {
    const userData = await db.user.upsert({
      create: { discordUserId },
      where: { discordUserId },
      update: data ?? {},
    });
    return new User(userData);
  }
  public static async load(discordUserId: string) {
    const userData = await db.user.findUniqueOrThrow({
      where: { discordUserId },
    });
    return new User(userData);
  }

  public static async remove(discordUserId: string) {
    await db.user.delete({
      where: { discordUserId },
    });
  }

  public async grantBadge(badge: bigint) {
    this.data.badges |= badge;
    this.data = (await User.upsert(this.data.id, this.data)).data;
    return this.data.badges;
  }

  public async revokeBadge(badge: bigint) {
    this.data.badges &= ~badge;
    this.data = (await User.upsert(this.data.id, this.data)).data;
    return this.data.badges;
  }
}
