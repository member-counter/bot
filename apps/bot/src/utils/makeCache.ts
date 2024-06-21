import type { BotInstanceOptions } from "@mc/common/BotInstanceOptions";
import { Options } from "discord.js";

export const makeCache = (options: BotInstanceOptions) =>
  Options.cacheWithLimits({
    AutoModerationRuleManager: 0,
    ApplicationCommandManager: undefined,
    BaseGuildEmojiManager: undefined,
    DMMessageManager: 0,
    GuildEmojiManager: undefined,
    GuildMemberManager:
      options.isPrivileged && options.isPremium
        ? undefined
        : {
            maxSize: 0,
            keepOverLimit: (member) => member.id === member.client.user.id,
          },
    GuildBanManager: undefined,
    GuildForumThreadManager: 0,
    GuildInviteManager: 0,
    GuildMessageManager: 0,
    GuildScheduledEventManager: 0,
    GuildStickerManager: 0,
    GuildTextThreadManager: 0,
    MessageManager: 0,
    PresenceManager: options.isPrivileged && options.isPremium ? undefined : 0,
    ReactionManager: 0,
    ReactionUserManager: 0,
    StageInstanceManager: 0,
    ThreadManager: 0,
    ThreadMemberManager: 0,
    UserManager: undefined,
    VoiceStateManager: options.isPremium ? undefined : 0,
  });
