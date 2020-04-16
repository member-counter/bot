import GuildModel from '../models/GuildModel';
import AvailableLanguagesStrings from '../typings/Languages';
import {
  ChannelTopicCounter,
  ChannelNameCounter,
} from '../typings/ChannelCounters';

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

  public get language(): string {
    if (!this.isInitialized) this.errorNotInit();
    return this.doc.language;
  }

  public async setLanguage(value: AvailableLanguagesStrings): Promise<void> {
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

  public async grantPremium(grantorId: string): Promise<number> {
    // TODO
    return 0;
  }

  public async deleteChannel(channelId: string): Promise<void> {
    if (!this.isInitialized) this.errorNotInit();
    await this.doc.counters.delete(channelId);
    await this.doc.counters.delete(channelId);
    await this.doc.save();
  }
}

export default GuildService;
