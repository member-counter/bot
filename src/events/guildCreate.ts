import getEnv from "../utils/getEnv";
import Eris from "eris";
import GuildService from "../services/GuildService";
import { availableLanguagePacks } from "../utils/languagePack";

const { PREMIUM_BOT_ID, PREMIUM_BOT, UNRESTRICTED_MODE } = getEnv();

const guildCreate = async (guild: Eris.Guild) => {
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
	const languageToSet = guild.preferredLocale.replace(/-/g, "_");
	if (availableLanguagePacks.includes(languageToSet)) {
		await guildSettings.setLanguage(languageToSet);
	}
};

export default guildCreate;
