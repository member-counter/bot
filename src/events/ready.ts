import logger from "../logger";
import { Event } from "../structures";
import getBotInviteLink from "../utils/getBotInviteLink";

export const readyEvent = new Event({
	name: "ready",
	handler: (client) => {
		logger.info(`Bot ready, logged in as ${client.user.tag}`);
		logger.info(`Invite link: ${getBotInviteLink()}`);
	}
});
