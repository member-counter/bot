import Eris from "eris";

export const neededBotPermissions: (keyof Eris.Constants["Permissions"])[] = [
	"manageChannels",
	"viewChannel",
	"voiceConnect",
	"readMessageHistory",
	"sendMessages",
	"embedLinks",
	"addReactions",
	"manageMessages",
	"banMembers"
];

export const neededBotPermissionsBitfield: BigInt = neededBotPermissions.reduce(
	(acc, cur) => acc | Eris.Constants.Permissions[cur],
	0n
);

export default neededBotPermissions;
