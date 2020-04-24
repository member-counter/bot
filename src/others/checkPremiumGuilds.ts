import Eris from 'eris';
import GuildService from '../services/GuildService';
import getEnv from '../utils/getEnv';

const { PREMIUM_BOT, FOSS_MODE } = getEnv();

export default (guilds: Eris.Collection<Eris.Guild>) => {
  if (PREMIUM_BOT && !FOSS_MODE) {
    guilds.forEach(async (guild) => {
      const guildSettings = await GuildService.init(guild.id);
      if (!guildSettings.premium) guild.leave().catch(console.error);
    });
  }
};
