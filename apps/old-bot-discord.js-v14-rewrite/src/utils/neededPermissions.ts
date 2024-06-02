import { PermissionsString, PermissionFlagsBits } from "discord.js";

// TODO: recollect all from Interaction neededPermissions

export const neededBotPermissions: PermissionsString[] = [
	"ManageChannels",
	"ViewChannel",
	"Connect",
	"ReadMessageHistory",
	"SendMessages",
	"EmbedLinks",
	"AddReactions",
	"ManageRoles",
	"ManageMessages",
	"BanMembers"
];

export const neededBotPermissionsBitField: bigint = neededBotPermissions.reduce(
	(acc, cur) => acc | PermissionFlagsBits[cur],
	0n
);

export default neededBotPermissions;
