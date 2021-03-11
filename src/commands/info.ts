import getEnv from "../utils/getEnv";
import Command from "../typings/Command";
import embedBase from "../utils/embedBase";

const {
	DONATION_URL,
	DISCORD_BOT_INVITE,
	DISCORD_OFFICIAL_SERVER_URL
} = getEnv();

const info: Command = {
	aliases: ["info", "invite", "github", "support", "bug"],
	denyDm: false,
	run: async ({ message, languagePack, client }) => {
		const { channel } = message;
		const embed = embedBase(languagePack.commands.info.embedReply);
		embed.description = embed.description
			.replace("{DONATION_URL}", DONATION_URL)
			.replace("{BOT_SERVER_URL}", DISCORD_OFFICIAL_SERVER_URL)
			.replace("{BOT_INVITE_URL}", DISCORD_BOT_INVITE);

		embed.thumbnail = {
			url: client.user.dynamicAvatarURL()
		};

		await channel.createMessage({ embed });
	}
};

const infoCommands = [info];

export default infoCommands;
