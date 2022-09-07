import getEnv from "./getEnv";
import { neededBotPermissionsBitField } from "./neededBotPermissions";

const { DISCORD_CLIENT_ID } = getEnv();

const inviteLink = new URL("https://discord.com/oauth2/authorize");
inviteLink.searchParams.set("client_id", DISCORD_CLIENT_ID);
inviteLink.searchParams.set(
	"permissions",
	neededBotPermissionsBitField.toString()
);
inviteLink.searchParams.set(
	"scope",
	["bot", "applications.commands"].join(" ")
);

function getBotInviteLink(): string {
	return inviteLink.toString();
}

export default getBotInviteLink;
