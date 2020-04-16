import GuildModel from '../models/GuildModel';
import AvailableLanguages from '../typings/AvailableLanguages';

class GuildService {
  private doc: any;

  public constructor(public id: string) {}

  public async init(): Promise<void> {
    this.doc = await GuildModel.findOneAndUpdate(
      { guild: this.id },
      {},
      { new: true, upsert: true },
    );
  }

  private get isInitialized(): boolean {
    return !!this.doc;
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

  public async upgradeServer(
    grantorId: string,
  ): Promise<'success' | 'noUpgradesAvailable' | 'alreadyUpgraded'> {
    if (!this.isInitialized) this.errorNotInit();
    // TODO
    return 'success';
  }

  public get customCounterDigits(): Map<number, string> {
    if (!this.isInitialized) this.errorNotInit();
    return this.doc.customCounterDigits;
  }

  public async setCustomCounterDigit(
    number: number,
    value: string,
  ): Promise<void> {
    if (!this.isInitialized) this.errorNotInit();
    this.doc.customCounterDigits.set(number, value);
    await this.doc.save();
  }

  public get globalChannelTopic(): string {
    if (!this.isInitialized) this.errorNotInit();
    return this.doc.globalChannelTopic;
  }

  public async setGlobalChannelTopic(value: string): Promise<void> {
    if (!this.isInitialized) this.errorNotInit();
    this.doc.globalChannelTopic = value;
    await this.doc.save();
  }

  public get counters(): Map<string, string> {
    if (!this.isInitialized) this.errorNotInit();
    return this.doc.counters;
  }

  public async setCounter(channelId: string, data: string): Promise<void> {
    if (!this.isInitialized) this.errorNotInit();
    // TODO
  }

  public async deleteCounter(channelId: string): Promise<void> {
    if (!this.isInitialized) this.errorNotInit();
    this.doc.counters.delete(channelId);
    await this.doc.save();
  }

  public async resetSettings(): Promise<void> {
    if (!this.isInitialized) this.errorNotInit();
    // TODO
  }
}

export default GuildService;
