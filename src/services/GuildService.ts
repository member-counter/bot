import GuildModel from '../models/GuildModel';
import UserModel from '../models/UserModel';

class GuildService {
  private constructor(public id: string, private doc: any) {}

  public static async init(id: string): Promise<GuildService> {
    const doc = await GuildModel.findOneAndUpdate(
      { guild: id },
      {},
      { new: true, upsert: true },
    );
    return new GuildService(id, doc);
  }

  public get language(): string {
    return this.doc.language;
  }

  public async setLanguage(value: string): Promise<void> {
    this.doc.language = value;
    await this.doc.save();
  }

  public get prefix(): string {
    return this.doc.prefix;
  }

  public async setPrefix(newPrefix: string): Promise<string> {
    this.doc.prefix = newPrefix;
    await this.doc.save();
    return this.doc.prefix;
  }

  public get allowedRoles(): string[] {
    return this.doc.allowedRoles;
  }

  public async setAllowedRoles(roles: string[]): Promise<string[]> {
    this.doc.allowedRoles = roles;
    await this.doc.save();
    return this.doc.allowedRoles;
  }

  public async setShortNumber(state: boolean): Promise<boolean> {
    this.doc.shortNumber = state;
    await this.doc.save();
    return this.doc.shortNumber;
  }

  public get shortNumber(): boolean {
    return this.doc.shortNumber;
  }

  public get premium(): boolean {
    return this.doc.premium;
  }

  public async upgradeServer(
    grantorId: string,
  ): Promise<'success' | 'noUpgradesAvailable' | 'alreadyUpgraded'> {
    if (this.premium) return 'alreadyUpgraded';

    const userDoc: any = await UserModel.findOneAndUpdate(
      { user: grantorId },
      {},
      { new: true, upsert: true },
    );

    if (userDoc.availableServerUpgrades <= 0) return 'noUpgradesAvailable';

    userDoc.availableServerUpgrades -= 1;
    this.doc.premium = true;

    await this.doc.save();
    await userDoc.save();

    return 'success';
  }

  public get digits(): string[] {
    return this.doc.digits;
  }

  public async setDigit(number: number, value: string): Promise<void> {
    this.doc.digits[number] = value;
    this.doc.markModified('digits');
    await this.doc.save();
  }

  public async resetDigits(): Promise<void> {
    this.doc.digits = undefined;
    await this.doc.save();
  }

  public get counters(): Map<string, string> {
    return this.doc.counters;
  }

  public async setCounter(
    channelId: string,
    content: string,
  ): Promise<Map<string, string>> {
    this.doc.counters.set(channelId, content);
    await this.doc.save();
    return this.counters;
  }

  public async deleteCounter(channelId: string): Promise<void> {
    this.doc.counters.delete(channelId);
    await this.doc.save();
  }

  public async resetSettings(): Promise<void> {
    const premiumStatus = this.premium;
    await GuildModel.findOneAndRemove({ guild: this.id });
    this.doc = await GuildModel.create({
      guild: this.id,
      premium: premiumStatus,
    });
  }
}

export default GuildService;
