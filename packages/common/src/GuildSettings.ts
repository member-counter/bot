import { db } from "@mc/db";

export type GuildData = Awaited<ReturnType<typeof db.guild.upsert>>;

export class GuildSettings {
  private constructor(public data: GuildData) {}

  public static async upsert(
    discordGuildId: string,
    data?: Partial<GuildData>,
  ) {
    const guildData = await db.guild.upsert({
      create: { discordGuildId, formatSettings: {} },
      where: { discordGuildId },
      update: data ?? {},
    });
    return new GuildSettings(guildData);
  }

  public static async load(discordGuildId: string) {
    const guildData = await db.guild.findUnique({
      where: { discordGuildId },
    });

    if (!guildData) return null;

    return new GuildSettings(guildData);
  }

  public static async reset(discordGuildId: string) {
    await db.guild.delete({
      where: { discordGuildId },
    });

    return await GuildSettings.upsert(discordGuildId);
  }
}
