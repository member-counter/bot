import { PermissionsBitField } from "discord.js";

import config from "../config";
import { allEventsNeededPermissions } from "../events";
import { allCommandsNeededPermissions } from "../interactions/commands";
import { tokenToClientId } from "./tokenToClientId";

const clientId = tokenToClientId(config.discord.bot.token);

function getBotInviteLink(guildId?: string, botId?: string): string {
	// TODO: get from neededPermissions
	const allNeededPermissions = new PermissionsBitField([
		allCommandsNeededPermissions,
		allEventsNeededPermissions
	]);

	const inviteLink = new URL("https://discord.com/oauth2/authorize");
	inviteLink.searchParams.set("client_id", botId ?? clientId);
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
