import Bot from "../bot";
import setupJobs from "../jobs";
import embedBase from "../utils/embedBase";
import getBotInviteLink from "../utils/getBotInviteLink";
import getMotd from "../utils/getMOTD";
import initializeClientStats from "../utils/initializeClientStats";

const ready = () => {
	const { username, discriminator } = Bot.client.user;
	console.log(`Bot ready - ${username}#${discriminator}`);
	console.log(`Invite link: ${getBotInviteLink()}`);
	setupJobs();
	initializeClientStats(Bot.client);
	// create an embed to fetch the bot's avatar and get and cache its color
	embedBase();

	// fetch motd
	getMotd();
};

export default ready;
