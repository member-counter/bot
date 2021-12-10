import getEnv from "../utils/getEnv";
import Command from "../typings/Command";
import embedBase from "../utils/embedBase";
import UserError from "../utils/UserError";

const { GET_PREMIUM_BOT_URL } = getEnv();

const premium: Command = {
	aliases: ["premium", "donate", "donor", "donations"],
	denyDm: false,
	run: async ({ message, languagePack, client }) => {
		const { channel } = message;
		const embed = embedBase(languagePack.commands.premium.embedReply);
		embed.description = embed.description.replace(
			"{GET_PREMIUM_BOT_URL}",
			GET_PREMIUM_BOT_URL
		);

		await channel.createMessage({ embeds: [embed] });
	}
};

const premiumCommands = [premium];

export default premiumCommands;
