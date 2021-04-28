import getEnv from '../utils/getEnv';
import Eris from 'eris';
import GuildService from '../services/GuildService';
import { availableLanguagePacks } from '../utils/languagePack';
import GuildCountCacheModel from '../models/GuildCountCache';

const { PREMIUM_BOT_ID, PREMIUM_BOT, UNRESTRICTED_MODE } = getEnv();

const guildCreate = async (guild: Eris.Guild) => {
  // @ts-ignore
  const client: Eris.Client = guild._client;
  const guildSettings = await GuildService.init(guild.id);

	if (guildSettings.blocked) {
		await guild.leave();
		return;
	}

	await guildSettings.setLocale(guild.preferredLocale);

	// Self kick when premium bot is present and the guild is premium
	if (!PREMIUM_BOT && !UNRESTRICTED_MODE) {
		const premiumBotMember = await guild
			.getRESTMember(PREMIUM_BOT_ID)
			.catch(() => {});

		if (guildSettings.premium && premiumBotMember) {
			guild.leave().catch(console.error);
		}
	}

  // set language
  const languageToSet = guild.preferredLocale.replace(/-/g, '_');
  if (availableLanguagePacks.includes(languageToSet)) {
    await guildSettings.setLanguage(languageToSet);
  }


  const guildCountCache = await GuildCountCacheModel.findOneAndUpdate({ guild: guild.id }, {}, { upsert: true, new: true });
  const guildExt = await client.getRESTGuild(guild.id, true);

  guildCountCache.members = guildExt.approximateMemberCount;
  guildCountCache.onlineMembers = guildExt.approximatePresenceCount;
  guildCountCache.timestamp = Date.now();
  await guildCountCache.save();
};

export default guildCreate;
