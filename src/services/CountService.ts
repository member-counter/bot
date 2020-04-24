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
import fetchExternalCount from '../utils/externalCounts';

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
    const guildSettings = await GuildService.init(guild.id);
    return new CountService(guild, guildSettings);
  }

  public async updateCounters(): Promise<void> {
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
    const typeL = type.toLowerCase();

    if (typeL === '{members}') {
      this.countCache[type] = this.guild.memberCount;
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
      this.countCache[type] = this.guild.channels.filter(
        (channel) => channel.type !== 4,
      ).length;
    } else if (typeL === '{roles}') {
      this.countCache[type] = this.guild.roles.size;
    } else if (typeL === '{connectedmembers}') {
      if (!PREMIUM_BOT || !FOSS_MODE) {
        this.countCache[type] = -1;
      }

      this.countCache[type] = this.guild.channels
        .filter((channel) => channel.type === 2)
        .reduce(
          (prev, current: VoiceChannel) => prev + current.voiceMembers.size,
          0,
        );
    } else if (typeL === '{bannedmembers}') {
      this.countCache[type] = await this.guild
        .getBans()
        .then((bans) => bans.length)
        .catch((error) => {
          console.error(error);
          this.countCache[type] = -2;
        });
    } else if (
      /\{memberswithrole:.+\}/.test(typeL) ||
      /\{onlinememberswithrole:.+\}/.test(typeL) ||
      /\{offlinememberswithrole:.+\}/.test(typeL)
    ) {
      const targetRoles: string[] = type
        .slice(type.indexOf(':') + 1, -1)
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
        this.countCache[type] = await fetchExternalCount(type);
      } catch (error) {
        this.countCache[type] = -2;
      }
    }
  }
}

export default CountService;
