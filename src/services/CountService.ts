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
import ExternalCounts from '../utils/externalCounts';
import shortNumber from '../utils/shortNumbers';

const { FOSS_MODE, PREMIUM_BOT } = getEnv();

class CountService {
  private client: Client;
  private languagePack: any;
  private countCache: any;

  private constructor(
    public guild: Guild,
    private guildSettings: GuildService,
  ) {
    //@ts-ignore
    this.client = this.guild._client;
    this.languagePack = loadLanguagePack(this.guildSettings.language);
    this.countCache = {};
  }

  public static async init(guild: Guild): Promise<CountService> {
    if (guild.unavailable) throw new Error(`Guild ${guild.id} is unavailable`);
    const guildSettings = await GuildService.init(guild.id);
    return new CountService(guild, guildSettings);
  }

  public async updateCounters(): Promise<void> {
    const { channels } = this.guild;

    for (const [id, rawContent] of this.guildSettings.counters) {
      const discordChannel = channels.get(id);

      if (!discordChannel) {
        await this.guildSettings.deleteCounter(id);
        return;
      }

      const counterIsNameType =
        discordChannel instanceof VoiceChannel ||
        discordChannel instanceof CategoryChannel;

      const counterIsTopicType =
        discordChannel instanceof TextChannel ||
        discordChannel instanceof NewsChannel;

      let processedContent = await this.processContent({
        rawContent,
        customDigits: counterIsTopicType,
        shortNumbers: counterIsNameType && this.guildSettings.shortNumber,
      });

      if (counterIsTopicType) {
        if (
          botHasPermsToEdit(discordChannel) &&
          //@ts-ignore
          discordChannel.topic !== processedContent
        )
          await discordChannel.edit({ topic: processedContent.slice(0, 1023) });
      } else if (counterIsNameType) {
        if (processedContent.length < 2) return;
        if (
          botHasPermsToEdit(discordChannel) &&
          //@ts-ignore
          discordChannel.name !== processedContent
        ) {
          const nameToSet =
            processedContent.length > 2
              ? processedContent.slice(0, 99)
              : this.languagePack.functions.getCount.invalidChannelLength;
          await discordChannel.edit({ name: nameToSet });
        }
      }
    }
  }

  private async processContent({
    rawContent,
    customDigits,
    shortNumbers,
  }: {
    rawContent: string;
    customDigits: boolean;
    shortNumbers: boolean;
  }): Promise<string> {
    let content: string[] = rawContent.split('');
    customDigits;
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
        let count = await this.getCount(`{${counterDetected}}`, customDigits);
        if (shortNumbers) count = shortNumber(parseInt(count, 10));

        content.splice(counterDetectedAt, counterDetected.length + 2, count);

        index = 0;
        isCounterBeingDetected = false;
        counterDetected = '';
        counterDetectedAt = 0;
      }
    }

    return content.join('');
  }

  public async getCount(
    type: string,
    customDigits: boolean = false,
  ): Promise<string> {
    const typeL = type.toLowerCase();

    if (!this.countCache[typeL]) {
      await this.fetchCount(type);
    }

    // TODO add translations
    if (this.countCache[typeL] === -1)
      return this.languagePack.functions.getCounts.onlyPremium;
    if (this.countCache[typeL] === -2) return this.languagePack.common.error;
    if (this.countCache[typeL] === -3)
      return this.languagePack.functions.getCounts.unknownCounter;

    if (customDigits) {
      if (!this.countCache[`${typeL}CustomDigit`]) {
        let rawCount: number = this.countCache[typeL];
        let processedCount: string = rawCount.toString();

        processedCount = processedCount
          .split('')
          .map((digit) => this.guildSettings.digits[digit])
          .join('');

        this.countCache[`${typeL}CustomDigit`] = processedCount;
      }

      return this.countCache[`${typeL}CustomDigit`].toString();
    } else {
      return this.countCache[typeL].toString();
    }
  }

  /** Return: -1 = Premium, -2 = Error, -3 = Unknown counter */
  private async fetchCount(type: string): Promise<void> {
    const typeL = type.toLowerCase();

    if (typeL === '{members}') {
      this.countCache[typeL] = this.guild.memberCount;
    } else if (
      typeL === '{users}' ||
      typeL === '{bots}' ||
      typeL === '{onlinemembers}' ||
      typeL === '{onlineusers}' ||
      typeL === '{onlinebots}' ||
      typeL === '{offlinemembers}' ||
      typeL === '{offlineusers}' ||
      typeL === '{offlinebots}'
    ) {
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
    } else if (typeL === '{channels}') {
      this.countCache[typeL] = this.guild.channels.filter(
        (channel) => channel.type !== 4,
      ).length;
    } else if (typeL === '{roles}') {
      this.countCache[typeL] = this.guild.roles.size;
    } else if (typeL === '{connectedmembers}') {
      if (!PREMIUM_BOT || !FOSS_MODE) {
        this.countCache[typeL] = -1;
      }

      this.countCache[typeL] = this.guild.channels
        .filter((channel) => channel.type === 2)
        .reduce(
          (prev, current: VoiceChannel) => prev + current.voiceMembers.size,
          0,
        );
    } else if (typeL === '{bannedmembers}') {
      this.countCache[typeL] = await this.guild
        .getBans()
        .then((bans) => bans.length)
        .catch((error) => {
          console.error(error);
          this.countCache[typeL] = -2;
        });
    } else if (
      /\{memberswithrole:.+\}/.test(typeL) ||
      /\{onlinememberswithrole:.+\}/.test(typeL) ||
      /\{offlinememberswithrole:.+\}/.test(typeL)
    ) {
      const targetRoles: string[] = typeL
        .slice(typeL.indexOf(':') + 1, -1)
        .split(',');

      if (!PREMIUM_BOT || !FOSS_MODE) {
        this.countCache[`{memberswithrole:${targetRoles.join(',')}}`] = -1;
        this.countCache[
          `{onlinememberswithrole:${targetRoles.join(',')}}`
        ] = -1;
        this.countCache[
          `{offlinememberswithrole:${targetRoles.join(',')}}`
        ] = -1;
        return;
      }

      const membersWithRole = new Set();
      const onlineMembersWithRole = new Set();
      const offlineMembersWithRole = new Set();

      this.guild.members.forEach((member) => {
        targetRoles.forEach((targetRole) => {
          if (member.roles.includes(targetRole)) {
            membersWithRole.add(member.id);
            if (member.status === 'offline')
              offlineMembersWithRole.add(member.id);
            else onlineMembersWithRole.add(member.id);
          }
        });
      });

      this.countCache[`{memberswithrole:${targetRoles.join(',')}}`] =
        membersWithRole.size;
      this.countCache[`{onlinememberswithrole:${targetRoles.join(',')}}`] =
        onlineMembersWithRole.size;
      this.countCache[`{offlinememberswithrole:${targetRoles.join(',')}}`] =
        offlineMembersWithRole.size;
    } else {
      try {
        this.countCache[typeL] = await ExternalCounts.get(type);
      } catch (error) {
        console.error(error);
        this.countCache[typeL] = -2;
      }
    }
  }
}

export default CountService;
