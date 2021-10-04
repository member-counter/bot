import getEnv from "./getEnv";
import { neededBotPermissionsBitfield } from "./neededBotPermissions";

const { DISCORD_CLIENT_ID } = getEnv();

function getBotInviteLink(): string {
	return `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=${neededBotPermissionsBitfield}&scope=bot%20applications.commands`;
}

export default getBotInviteLink;
