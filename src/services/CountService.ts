import { Guild, VoiceChannel } from 'eris';
import GuildService from './GuildService';
import { loadLanguagePack } from '../utils/languagePack';
import getEnv from '../utils/getEnv';

const { FOSS_MODE, PREMIUM_BOT } = getEnv();

class CountService {
  private guildSettings: GuildService;
  private languagePack: any;
  private countCache: any;
  private isInitialized: boolean = false;

  constructor(public guild: Guild) {
    this.countCache = {};
  }

  public async init(): Promise<void> {
    this.guildSettings = new GuildService(this.guild.id);
    await this.guildSettings.init();
    this.languagePack = loadLanguagePack(this.guildSettings.language);
    this.isInitialized = true;
  }

  private errorNotInit(): never {
    throw new Error('You must call .init() first');
  }

  public async updateCounters(): Promise<void> {
    const { channels } = this.guild;
  }

  public async getCount(
    type: string,
    customDigits: boolean = false,
  ): Promise<string> {
    if (!this.isInitialized) this.errorNotInit();
    if (!this.countCache[type]) {
      await this.fetchCount(type);
    }

    if (customDigits) {
      if (!this.countCache[`${type}CustomDigit`]) {
        let rawCount: number = this.countCache[type];
        let processedCount: string = rawCount.toString();

        processedCount = processedCount
          .split('')
          .map((digit, i) => this.guildSettings.digits[i])
          .join('');

        this.countCache[`${type}CustomDigit`] = processedCount;
      }

      return this.countCache[`${type}CustomDigit`].toString();
    } else {
      this.countCache[type].toString();
    }
  }

  private async fetchCount(type): Promise<void> {
    if (type === '{members}') {
      this.countCache[type] = this.guild.memberCount;
    } else if (
      type === '{users}' ||
      type === '{bots}' ||
      type === '{onlinemembers}' ||
      type === '{onlineusers}' ||
      type === '{onlinebots}' ||
      type === '{offlinemembers}' ||
      type === '{offlineusers}' ||
      type === '{offlinebots}'
    ) {
      const counts = {
        bots: 0,
        users: 0,
        onlineMembers: 0,
        offlineMembers: 0,
        onlineUsers: 0,
        offlineUsers: 0,
        onlineBots: 0,
        offlineBots: 0,
      };
      if (!PREMIUM_BOT || !FOSS_MODE) {
        // If the bot is in non-premium mode, replace all member related counts
        // except members to 'Only Premium'
        for (const key in counts) {
          counts[key] = -1;
        }
        this.countCache = { ...this.countCache, counts };
      }
      for (const [memberId, member] of this.guild.members) {
        const memberIsOffline = member.status === 'offline';

        if (member.bot) counts.bots++;
        else counts.users++;

        if (memberIsOffline) counts.offlineMembers++;
        else counts.onlineMembers++;

        if (memberIsOffline && member.bot) counts.offlineBots++;
        else if (memberIsOffline) counts.offlineUsers++;

        if (!memberIsOffline && member.bot) counts.onlineBots++;
        else if (!memberIsOffline) counts.onlineUsers++;
      }
      this.countCache = { ...this.countCache, counts };
    } else if (type === '{channels}') {
      this.countCache[type] = this.guild.channels.filter(
        (channel) => channel.type !== 4,
      ).length;
    } else if (type === '{roles}') {
      this.countCache[type] = this.guild.roles.size;
    } else if (type === '{connectedmembers}') {
      if (PREMIUM_BOT || FOSS_MODE) {
        this.countCache[type] = -1;
      }

      this.countCache[type] = this.guild.channels
        .filter((channel) => channel.type === 2)
        .reduce(
          (prev, current: VoiceChannel) => prev + current.voiceMembers.size,
          0,
        );
    } else if (type === '{bannedmembers}') {
      this.countCache[type] = await this.guild
        .getBans()
        .then((bans) => bans.length)
        .catch((error) => {
          console.error(error);
          this.countCache[type] = -2;
        });
    } else if (/\{memberswithrole:\}/.test(type)) {
    }
  }
}

export default CountsService;
