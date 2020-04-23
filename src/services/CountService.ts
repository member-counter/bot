import Eris, {
  Guild,
  VoiceChannel,
  Client,
  TextChannel,
  NewsChannel,
  CategoryChannel,
} from 'eris';
import GuildService from './GuildService';
import { loadLanguagePack } from '../utils/languagePack';
import getEnv from '../utils/getEnv';
import botHasPermsToEdit from '../utils/botHasPermsToEdit';

const { FOSS_MODE, PREMIUM_BOT } = getEnv();

class CountService {
  private client: Client;
  private guildSettings: GuildService;
  private languagePack: any;
  private countCache: any;
  private isInitialized: boolean = false;
  public guild: Guild;

  constructor(guild: Guild) {
    this.countCache = {};
    this.guild = guild;
    //@ts-ignore
    this.client = this.guild._client;
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
    if (!this.isInitialized) this.errorNotInit();
    const { channels } = this.guild;

    for (const [id, rawContent] of this.guildSettings.counters) {
      const discordChannel = channels.get(id);
      let processedContent = await this.processContent(
        rawContent,
        discordChannel instanceof TextChannel ||
          discordChannel instanceof NewsChannel,
      );

      // TODO remove channel from DB if it doesnt exists anymore
      if (
        discordChannel instanceof TextChannel ||
        discordChannel instanceof NewsChannel
      ) {
        if (
          botHasPermsToEdit(discordChannel) &&
          discordChannel.topic !== processedContent
        )
          await discordChannel.edit({ topic: processedContent });
      } else if (
        discordChannel instanceof VoiceChannel ||
        discordChannel instanceof CategoryChannel
      ) {
        if (processedContent.length < 2) return;
        if (
          botHasPermsToEdit(discordChannel) &&
          discordChannel.name !== processedContent
        )
          await discordChannel.edit({ name: processedContent });
      }
    }
  }

  private async processContent(content, customDigits): Promise<string> {
    content = content.split('');

    let isCounterBeingDetected = false;
    let counterDetected = '';
    let counterDetectedAt = 0;
    for (let index = 0; index < content.length; index++) {
      const char = content[index];

      if (!isCounterBeingDetected && char === '{') {
        isCounterBeingDetected = true;
        counterDetectedAt = index;
      } else if (isCounterBeingDetected && !(char === '{' || char === '}')) {
        counterDetected += char;
      } else if (isCounterBeingDetected && char === '}') {
        content.splice(
          counterDetectedAt,
          counterDetected.length + 2,
          await this.getCount(`{${counterDetected}}`, customDigits),
        );

        index = 0;
        isCounterBeingDetected = false;
        counterDetected = '';
        counterDetectedAt = 0;
      }
    }

    content = content.join('');

    return content;
  }

  public async getCount(
    type: string,
    customDigits: boolean = false,
  ): Promise<string> {
    if (!this.isInitialized) this.errorNotInit();
    if (!this.countCache[type]) {
      await this.fetchCount(type);
    }

    // TODO add translations
    if (this.countCache[type] === -1)
      return this.languagePack.functions.getCounts.onlyPremium;
    if (this.countCache[type] === -2) return this.languagePack.common.error;
    if (this.countCache[type] === -3)
      return this.languagePack.functions.getCounts.unknownCounter;

    if (customDigits) {
      if (!this.countCache[`${type}CustomDigit`]) {
        let rawCount: number = this.countCache[type];
        let processedCount: string = rawCount.toString();

        processedCount = processedCount
          .split('')
          .map((digit) => this.guildSettings.digits[digit])
          .join('');

        this.countCache[`${type}CustomDigit`] = processedCount;
      }

      return this.countCache[`${type}CustomDigit`].toString();
    } else {
      return this.countCache[type].toString();
    }
  }

  /** Return: -1 = Premium, -2 = Error, -3 = Unknown counter */
  private async fetchCount(type: string): Promise<void> {
    if (!this.isInitialized) this.errorNotInit();
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
      const NS_PER_SEC = 1e9;
      const time = process.hrtime();
      const counts = {
        ['{bots}']: 0,
        ['{users}']: 0,
        ['{onlinemembers}']: 0,
        ['{offlinemembers}']: 0,
        ['{onlineusers}']: 0,
        ['{offlineusers}']: 0,
        ['onlinebots']: 0,
        ['{offlinebots}']: 0,
      };
      if (!PREMIUM_BOT || !FOSS_MODE) {
        for (const key in counts) {
          counts[key] = -1;
        }
        this.countCache = { ...this.countCache, counts };
      }
      for (const [memberId, member] of this.guild.members) {
        const memberIsOffline = member.status === 'offline';

        if (member.bot) counts['{bots}']++;
        else counts['{users}']++;

        if (memberIsOffline) counts['{offlinemembers}']++;
        else counts['{onlinemembers}']++;

        if (memberIsOffline && member.bot) counts['{offlinebots}']++;
        else if (memberIsOffline) counts['{offlineusers}']++;

        if (!memberIsOffline && member.bot) counts['onlinebots']++;
        else if (!memberIsOffline) counts['{onlineusers}']++;
      }
      this.countCache = { ...this.countCache, ...counts };

      const diff = process.hrtime(time);
      console.log(
        `Member related counts (${this.guild.members.size} members) took ${
          diff[0] * NS_PER_SEC + diff[1]
        } nanoseconds (${diff[0] * NS_PER_SEC + diff[1] / 1e6} ms)`,
      );
    } else if (type === '{channels}') {
      this.countCache[type] = this.guild.channels.filter(
        (channel) => channel.type !== 4,
      ).length;
    } else if (type === '{roles}') {
      this.countCache[type] = this.guild.roles.size;
    } else if (type === '{connectedmembers}') {
      if (!PREMIUM_BOT || !FOSS_MODE) {
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
    } else if (/\{memberswithrole:.+\}/.test(type)) {
      if (!PREMIUM_BOT || !FOSS_MODE) {
        this.countCache[type] = -1;
      }
      const targetRoles: string[] = type
        .slice('{memberswithrole:'.length, -1)
        .split(',');

      const count = new Set();

      this.guild.members.forEach((member) => {
        targetRoles.forEach((targetRole) => {
          if (member.roles.includes(targetRole)) count.add(member.id);
        });
      });
      this.countCache[type] = count.size;
    } else {
      this.countCache[type] = -3;
    }
  }
}

export default CountService;
