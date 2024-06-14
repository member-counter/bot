import type { CacheFactory } from "discord.js";
import { Options } from "discord.js";

import { env } from "~/env";

const { DISCORD_BOT_IS_PRIVILEGED, DISCORD_BOT_IS_PREMIUM } = env;

export const makeCache: CacheFactory = Options.cacheWithLimits({
  AutoModerationRuleManager: 0,
  ApplicationCommandManager: undefined,
  BaseGuildEmojiManager: undefined,
  DMMessageManager: 0,
  GuildEmojiManager: undefined,
  GuildMemberManager:
    DISCORD_BOT_IS_PRIVILEGED && DISCORD_BOT_IS_PREMIUM
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
  PresenceManager:
    DISCORD_BOT_IS_PRIVILEGED && DISCORD_BOT_IS_PREMIUM ? undefined : 0,
  ReactionManager: 0,
  ReactionUserManager: 0,
  StageInstanceManager: 0,
  ThreadManager: 0,
  ThreadMemberManager: 0,
  UserManager: undefined,
  VoiceStateManager: DISCORD_BOT_IS_PREMIUM ? undefined : 0,
});
