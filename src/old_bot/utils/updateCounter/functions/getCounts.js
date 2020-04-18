const PREMIUM_BOT = JSON.parse(process.env.PREMIUM_BOT);
const FOSS_MODE = JSON.parse(process.env.FOSS_MODE);
const { DISCORD_CLIENT_ID } = process.env;
const { loadLanguagePack } = require('../../commandHandlerUtils');

const getBannedMembers = async (guild, guildSettings) => {
  const {
    channelNameCounters,
    topicCounterChannels,
    mainTopicCounter,
    lang,
  } = guildSettings;
  const languagePack = await loadLanguagePack(lang);
  const botMember = guild.members.get(DISCORD_CLIENT_ID);

  // Check if there is some counter of banned members and if the bot has perms to see banned members to avoid unncessary requests
  if (
    botMember.permission.has('banMembers') &&
    (Array.from(channelNameCounters).some(
      (channel) => channel[1].type === 'bannedmembers',
    ) ||
      Array.from(topicCounterChannels).some((channel) =>
        /\{bannedMembers\}/i.test(channel[1].topic),
      ) ||
      /\{bannedMembers\}/i.test(mainTopicCounter))
  ) {
    return await guild
      .getBans()
      .then((bans) => bans.length)
      .catch((error) => {
        console.error(error);
        return languagePack.common.error;
      });
  }

  return languagePack.functions.getCounts.no_ban_perms;
};

const getMembersRelatedCounts = async (guild, guildSettings) => {
  const { lang } = guildSettings;
  const languagePack = await loadLanguagePack(lang);

  const counts = {
    members: guild.memberCount,
    bots: 0,
    users: 0,
    onlineMembers: 0,
    offlineMembers: 0,
    onlineUsers: 0,
    offlineUsers: 0,
    onlineBots: 0,
    offlineBots: 0,
  };

  if (PREMIUM_BOT || FOSS_MODE) {
    for (const [memberId, member] of guild.members) {
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
  } else {
    // If the bot is in non-premium mode, replace all member related counts
    // except members to 'Only Premium'
    for (const key in counts) {
      if (key !== 'members')
        counts[key] = languagePack.functions.getCounts.only_premium;
    }
  }

  return counts;
};

const getConnectedUsers = async (guild, guildSettings) => {
  const { lang } = guildSettings;
  const languagePack = await loadLanguagePack(lang);

  if (PREMIUM_BOT || FOSS_MODE) {
    return guild.channels
      .filter((channel) => channel.type === 2)
      .reduce((prev, current) => prev + current.voiceMembers.size, 0);
  } else {
    return languagePack.functions.getCounts.only_premium;
  }
};

// Exclude categories
const getChannels = (guild) =>
  guild.channels.filter((channel) => channel.type !== 4).length;

module.exports = async (client, guildSettings) => {
  const guild = client.guilds.get(guildSettings.guild_id);

  return {
    ...(await getMembersRelatedCounts(guild, guildSettings)),
    bannedMembers: await getBannedMembers(guild, guildSettings),
    connectedUsers: await getConnectedUsers(guild, guildSettings),
    channels: getChannels(guild),
    roles: guild.roles.size,
  };
};
