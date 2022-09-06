import { allCommandsNeededPermissions } from "../interactions/commands";
import { allEventsNeededPermissions } from "../events";
import { tokenToClientId } from "./tokenToClientId";
import config from "../config";
import { Permissions } from "discord.js";

const clientId = tokenToClientId(config.discord.bot.token);

function getBotInviteLink(guildId?: string): string {
	const allNeededPermissions = new Permissions([
		allCommandsNeededPermissions,
		allEventsNeededPermissions
	]);

	const inviteLink = new URL("https://discord.com/oauth2/authorize");
	inviteLink.searchParams.set("client_id", clientId);
	inviteLink.searchParams.set(
		"permissions",
		allNeededPermissions.bitfield.toString()
	);
	inviteLink.searchParams.set(
		"scope",
		["bot", "applications.commands"].join(" ")
	);

	if (guildId) {
		inviteLink.searchParams.set("guild_id", guildId);
	}

	return inviteLink.toString();
}

export default getBotInviteLink;
