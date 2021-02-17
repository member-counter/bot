import getEnv from "./getEnv";

const { DISCORD_CLIENT_ID } = getEnv();

function getBotInviteLink(): string {
	return `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=269872209&scope=bot`;
}

export default getBotInviteLink;
