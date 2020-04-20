import getEnv from '../utils/getEnv';
import Eris from 'eris';
import GuildService from '../services/GuildService';

const { PREMIUM_BOT_ID, PREMIUM_BOT, FOSS_MODE } = getEnv();

const regionRelation = {
  brazil: 'pt_BR',
  russia: 'ru_RU',
};

const guildCreate = async (guild: Eris.Guild) => {
  // Self kick when premium bot is present and the guild is premium
  if (!PREMIUM_BOT && !FOSS_MODE) {
    const guildSettings = new GuildService(guild.id);
    await guildSettings.init();
    const premiumBotMember = await guild
      .getRESTMember(PREMIUM_BOT_ID)
      .catch(() => {});

    if (guildSettings.premium && premiumBotMember) {
      guild.leave().catch(console.error);
    }
  }

  // set language for the guild based on its voice region
  if (regionRelation[guild.region]) {
    const guildSettings = new GuildService(guild.id);
    await guildSettings.init();
    await guildSettings.setLanguage(regionRelation[guild.region]);
  }
};

export default guildCreate;
