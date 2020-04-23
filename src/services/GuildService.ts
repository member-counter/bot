import GuildModel from '../models/GuildModel';
import AvailableLanguages from '../typings/AvailableLanguages';
import UserModel from '../models/UserModel';

class GuildService {
  private doc: any;
  private isInitialized: boolean = false;

  public constructor(public id: string) {}

  public async init(): Promise<void> {
    this.doc = await GuildModel.findOneAndUpdate(
      { guild: this.id },
      {},
      { new: true, upsert: true },
    );
    this.isInitialized = true;
  }

  private errorNotInit(): never {
    throw new Error('You must call .init() first');
  }

  public get language(): AvailableLanguages {
    if (!this.isInitialized) this.errorNotInit();
    return this.doc.language;
  }

  public async setLanguage(value: AvailableLanguages): Promise<void> {
    if (!this.isInitialized) this.errorNotInit();
    this.doc.language = value;
    await this.doc.save();
  }

  public get prefix(): string {
    if (!this.isInitialized) this.errorNotInit();
    return this.doc.prefix;
  }

  public async setPrefix(newPrefix: string): Promise<string> {
    if (!this.isInitialized) this.errorNotInit();
    this.doc.prefix = newPrefix;
    await this.doc.save();
    return this.doc.prefix;
  }

  public get allowedRoles(): string[] {
    if (!this.isInitialized) this.errorNotInit();
    return this.doc.allowedRoles;
  }

  public async setAllowedRoles(roles: string[]): Promise<string[]> {
    if (!this.isInitialized) this.errorNotInit();
    this.doc.allowedRoles = roles;
    await this.doc.save();
    return this.doc.allowedRoles;
  }

  public get premium(): boolean {
    if (!this.isInitialized) this.errorNotInit();
    return this.doc.premium;
  }

  public async upgradeServer(
    grantorId: string,
  ): Promise<'success' | 'noUpgradesAvailable' | 'alreadyUpgraded'> {
    if (!this.isInitialized) this.errorNotInit();
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
    if (!this.isInitialized) this.errorNotInit();
    return this.doc.digits;
  }

  public async setDigit(number: number, value: string): Promise<void> {
    if (!this.isInitialized) this.errorNotInit();
    this.doc.digits[number] = value;
    this.doc.markModified('digits');
    await this.doc.save();
  }

  public async resetDigits(): Promise<void> {
    if (!this.isInitialized) this.errorNotInit();
    this.doc.digits = undefined;
    await this.doc.save();
  }

  public get counters(): Map<string, string> {
    if (!this.isInitialized) this.errorNotInit();
    return this.doc.counters;
  }

  public async setCounter(
    channelId: string,
    content: string,
  ): Promise<Map<string, string>> {
    if (!this.isInitialized) this.errorNotInit();
    this.doc.counters.set(channelId, content);
    await this.doc.save();
    return this.counters;
  }

  public async deleteCounter(channelId: string): Promise<void> {
    if (!this.isInitialized) this.errorNotInit();
    this.doc.counters.delete(channelId);
    await this.doc.save();
  }

  public async resetSettings(): Promise<void> {
    if (!this.isInitialized) this.errorNotInit();
    const premiumStatus = this.premium;
    await GuildModel.findOneAndRemove({ guild: this.id });
    this.doc = await GuildModel.create({
      guild: this.id,
      premium: premiumStatus,
    });
  }
}

export default GuildService;
