import getEnv from '../utils/getEnv';
import Eris from 'eris';
import GuildService from '../services/GuildService';

const { PREMIUM_BOT_ID, PREMIUM_BOT } = getEnv();

const regionRelation = {
  brazil: 'pt_BR',
};

const guildCreate = async (guild: Eris.Guild) => {
  if (!PREMIUM_BOT) {
    // TODO if premium bot is present leave the guild
  }

  // set language for the guild based on its voice region
  if (regionRelation[guild.region]) {
    const guildSettings = new GuildService(guild.id);
    await guildSettings.init();
    guildSettings.setLanguage(regionRelation[guild.region]);
  }
};

export default guildCreate;
