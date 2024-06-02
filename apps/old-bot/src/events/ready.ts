import Bot from "../bot";
import setupJobs from "../jobs";
import embedBase from "../utils/embedBase";
import getBotInviteLink from "../utils/getBotInviteLink";
import getMotd from "../utils/getMOTD";

const ready = () => {
	const { username, discriminator } = Bot.client.user;
	console.log(`Bot ready - ${username}#${discriminator}`);
	console.log(`Invite link: ${getBotInviteLink()}`);
	setupJobs();

	// create an embed to fetch the bot's avatar and get and cache its color
	embedBase();

	// fetch motd
	getMotd();
};

export default ready;
