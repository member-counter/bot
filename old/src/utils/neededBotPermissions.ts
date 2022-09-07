import Eris from "eris";

export const neededBotPermissions: (keyof Eris.Constants["Permissions"])[] = [
	"manageChannels",
	"viewChannel",
	"voiceConnect",
	"readMessageHistory",
	"sendMessages",
	"embedLinks",
	"addReactions",
	"manageRoles",
	"manageMessages",
	"banMembers"
];

export const neededBotPermissionsBitField: bigint = neededBotPermissions.reduce(
	(acc, cur) => acc | Eris.Constants.Permissions[cur],
	0n
);

export default neededBotPermissions;
