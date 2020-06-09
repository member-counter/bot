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
import ExternalCounts from '../counts/externalCounts';
import shortNumber from '../utils/shortNumbers';
import stringReplaceAsync from '../utils/stringReplaceAsync';

const { FOSS_MODE, PREMIUM_BOT } = getEnv();

class CountService {
  private client: Client;
  private languagePack: any;
  private countCache: Map<string, string | number>;

  private constructor(
    public guild: Guild,
    private guildSettings: GuildService,
  ) {
    //@ts-ignore
    this.client = this.guild._client;
    this.languagePack = loadLanguagePack(this.guildSettings.language);
    this.countCache = new Map();
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

      let processedContent = await this.processContent(
        rawContent,
        counterIsTopicType,
      );

      if (counterIsTopicType) {
        const topicToSet = processedContent.slice(0, 1023);
        if (
          botHasPermsToEdit(discordChannel) &&
          //@ts-ignore
          discordChannel.topic !== topicToSet
        )
          await discordChannel.edit({ topic: topicToSet });
      } else if (counterIsNameType) {
        const nameToSet =
          processedContent.length > 2
            ? processedContent.slice(0, 99)
            : this.languagePack.functions.getCounts.invalidChannelLength;
        if (
          botHasPermsToEdit(discordChannel) &&
          //@ts-ignore
          discordChannel.name !== nameToSet
        ) {
          await discordChannel.edit({ name: nameToSet });
        }
      }
    }
  }

  private processContent(
    content: string,
    customDigits: boolean = false,
  ): Promise<string> {
    return stringReplaceAsync(
      content,
      /\{(.+?)\}/gi,
      async (counterDetected) => {
        let count = await this.getCount(counterDetected, customDigits);
        const intCount = Number(count);

        if (!customDigits && intCount && this.guildSettings.shortNumber) {
          count = shortNumber(intCount);
        }

        return count;
      },
    );
  }

  public async getCount(
    type: string,
    customDigits: boolean = false,
  ): Promise<string> {
    const typeL = type.toLowerCase();

    if (!this.countCache.has(typeL)) {
      await this.fetchCount(type);
    }

    if (this.countCache.get(typeL) === -1)
      return this.languagePack.functions.getCounts.onlyPremium;
    if (this.countCache.get(typeL) === -2)
      return this.languagePack.common.error;
    if (this.countCache.get(typeL) === -3)
      return this.languagePack.functions.getCounts.unknownCounter;

    if (customDigits) {
      if (!this.countCache.has(`${typeL}CustomDigit`)) {
        let rawCount = this.countCache.get(typeL);

        let processedCount: string = rawCount.toString();

        if (Number(rawCount)) {
          processedCount = processedCount
          .split('')
          .map((digit) => this.guildSettings.digits[digit])
          .join('');
        }

        this.countCache.set(`${typeL}CustomDigit`, processedCount);
      }

      return this.countCache.get(`${typeL}CustomDigit`).toString();
    } else {
      return this.countCache.get(typeL).toString();
    }
  }

  /** Return: -1 = Premium, -2 = Error, -3 = Unknown counter */
  private async fetchCount(type: string): Promise<void> {
    // This part is for guild related counts, below at the end is the part that fetches couns from external resources
    const typeLC = type.toLowerCase();

    switch (typeLC) {
      case '{members}':
        this.countCache.set(typeLC, this.guild.memberCount);
        break;

      case '{bots}':
      case '{users}':
      case '{onlinemembers}':
      case '{offlinemembers}':
      case '{onlineusers}':
      case '{offlineusers}':
      case '{onlinebots}':
      case '{offlinebots}': {
        const counts = {
          ['{bots}']: 0,
          ['{users}']: 0,
          ['{onlinemembers}']: 0,
          ['{offlinemembers}']: 0,
          ['{onlineusers}']: 0,
          ['{offlineusers}']: 0,
          ['{onlinebots}']: 0,
          ['{offlinebots}']: 0,
        };

        if (!(PREMIUM_BOT || FOSS_MODE)) {
          for (const key in counts) {
            if (counts.hasOwnProperty(key)) {
              this.countCache.set(key, -1);
            }
          }
          return;
        }

        for (const [memberId, member] of this.guild.members) {
          const memberIsOffline = member.status === 'offline';

          if (member.bot) counts['{bots}']++;
          else counts['{users}']++;

          if (memberIsOffline) counts['{offlinemembers}']++;
          else counts['{onlinemembers}']++;

          if (memberIsOffline && member.bot) counts['{offlinebots}']++;
          else if (memberIsOffline) counts['{offlineusers}']++;

          if (!memberIsOffline && member.bot) counts['{onlinebots}']++;
          else if (!memberIsOffline) counts['{onlineusers}']++;
        }

        for (const [key, value] of Object.entries(counts)) {
          this.countCache.set(key, value);
        }

        break;
      }

      case '{channels}':
        this.countCache.set(
          typeLC,
          this.guild.channels.filter((channel) => channel.type !== 4).length,
        );
        break;

      case '{roles}':
        this.countCache.set(typeLC, this.guild.roles.size);
        break;

      case '{bannedmembers}': {
        this.countCache.set(
          typeLC,
          await this.guild
            .getBans()
            .then((bans) => bans.length)
            .catch(() => -2),
        );
        break;
      }

      default: {
        if (/\{connectedmembers(:.+)?\}/.test(typeLC)) {
          const targetChannels: string[] = /\{connectedmembers:.+\}/.test(typeLC)
            ? typeLC.slice(typeLC.indexOf(':') + 1, -1).split(',')
            : [];

          const targetChannelsString =
            targetChannels.length > 0 ? ':' + targetChannels.join(',') : '';

          if (!(PREMIUM_BOT || FOSS_MODE)) {
            this.countCache.set(
              `{connectedmembers${targetChannelsString}}`,
              -1,
            );
            return;
          }

          this.countCache.set(
            `{connectedmembers${targetChannelsString}}`,
            this.guild.channels
              .filter((channel) => channel.type === 2)
              .reduce((prev, current: VoiceChannel) => {
                if (
                  targetChannels.length > 0 &&
                  !targetChannels.includes(current.id)
                ) {
                  return prev;
                } else {
                  return prev + current.voiceMembers.size;
                }
              }, 0),
          );
        } else if (
          /\{memberswithrole:.+\}/.test(typeLC) ||
          /\{onlinememberswithrole:.+\}/.test(typeLC) ||
          /\{offlinememberswithrole:.+\}/.test(typeLC)
        ) {
          const targetRoles: string[] = typeLC
            .slice(typeLC.indexOf(':') + 1, -1)
            .split(',');
          const targetRolesString = targetRoles.join(',');

          let membersWithRole: any = new Set();
          let onlineMembersWithRole: any = new Set();
          let offlineMembersWithRole: any = new Set();

          if (PREMIUM_BOT || FOSS_MODE) {
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

            membersWithRole = membersWithRole.size;
            onlineMembersWithRole = onlineMembersWithRole.size;
            offlineMembersWithRole = offlineMembersWithRole.size;
          } else {
            membersWithRole = -1;
            onlineMembersWithRole = -1;
            offlineMembersWithRole = -1;
          }

          this.countCache.set(
            `{memberswithrole:${targetRolesString}}`,
            membersWithRole,
          );
          this.countCache.set(
            `{onlinememberswithrole:${targetRolesString}}`,
            onlineMembersWithRole,
          );
          this.countCache.set(
            `{offlinememberswithrole:${targetRolesString}`,
            offlineMembersWithRole,
          );
        } else if (/\{countdown:.+\}/.test(typeLC)) {
          // {countdown:date:format}
          const args = type.substring(1, type.length - 1).split(':');
          const format = args[2] || '%d:%h:%m';
          const date = parseInt(args[1], 10) * 1000;
          let timeLeft = new Date(date - Date.now());
          if (date - Date.now() < 0) timeLeft = new Date(0);

          const formated = format
            .replace(/%d/gi, `${Math.floor((timeLeft.getTime() / 1000) / 60 / 60 / 24)}`)
            .replace(/%h/gi, `${timeLeft.getUTCHours()}`)
            .replace(/%m/gi, `${timeLeft.getUTCMinutes()}`)
            .replace(/%s/gi, `${timeLeft.getUTCSeconds()}`);

          this.countCache.set(typeLC, formated);
        } else {
          // if the counter is not a guild-related one, check if it's a external one
          this.countCache.set(typeLC, await ExternalCounts.get(type));
        }
        break;
      }
    }
  }
}

export default CountService;
