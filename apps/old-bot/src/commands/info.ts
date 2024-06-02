import getEnv from "../utils/getEnv";
import Command from "../typings/Command";
import embedBase from "../utils/embedBase";

const {
	GET_PREMIUM_BOT_URL,
	DISCORD_BOT_INVITE,
	WEBSITE_URL,
	DISCORD_OFFICIAL_SERVER_URL
} = getEnv();

const info: Command = {
	aliases: ["info", "invite", "github", "support", "bug"],
	denyDm: false,
	run: async ({ message, languagePack, client }) => {
		const { channel } = message;
		const embed = embedBase(languagePack.commands.info.embedReply);
		embed.description = embed.description
			.replace("{GET_PREMIUM_BOT_URL}", GET_PREMIUM_BOT_URL)
			.replace("{WEBSITE}", WEBSITE_URL)
			.replace("{BOT_SERVER_URL}", DISCORD_OFFICIAL_SERVER_URL)
			.replace("{BOT_INVITE_URL}", DISCORD_BOT_INVITE);

		embed.thumbnail = {
			url: client.user.dynamicAvatarURL()
		};

		await channel.createMessage({ embeds: [embed] });
	}
};

const infoCommands = [info];

export default infoCommands;
