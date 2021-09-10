import getEnv from "./getEnv";
import Eris, { GuildTextableChannel, Message } from "eris";
import GuildService from "../services/GuildService";
import { loadLanguagePack } from "./languagePack";
import memberHasAdminPermission from "./memberHasAdminPermission";
import commandErrorHandler from "./commandErrorHandler";
import commands from "../commands/all";
import Bot from "../bot";
import LanguagePack from "../typings/LanguagePack";
import { GuildChannelCommand, AnyChannelCommand } from "../typings/Command";
import UserService from "../services/UserService";

const {
	PREMIUM_BOT,
	DISCORD_PREFIX,
	DISCORD_PREFIX_MENTION_DISABLE,
	DISCORD_DEFAULT_LANG,
	DISCORD_OFFICIAL_SERVER_ID,
	GHOST_MODE,
	BOT_OWNERS
} = getEnv();

export default async (message: Eris.Message) => {
	if (GHOST_MODE && !BOT_OWNERS.includes(message.author?.id)) return;

	const { channel, author, content } = message;
	const { client } = Bot;

	// Ignore requested commands in the official server since this server already has the premium bot
	if (
		channel instanceof Eris.GuildChannel &&
		!PREMIUM_BOT &&
		channel.guild.id === DISCORD_OFFICIAL_SERVER_ID
	) {
		return;
	}

	// Avoid responding to other bots
	if (author && !author.bot) {
		let prefixToCheck: string;
		let languagePack: LanguagePack;
		let clientIntegrationRoleId: string;
		let guildService: GuildService;

		// upsert the message author in the db
		await UserService.init(author.id);

		if (channel instanceof Eris.GuildChannel) {
			const { guild } = channel;

			guildService = await GuildService.init(guild.id);

			languagePack = loadLanguagePack(guildService.language);
			prefixToCheck = guildService.prefix;

			clientIntegrationRoleId = guild.members
				.get(client.user.id)
				?.roles.filter((roleID) =>
					guild.roles.get(roleID)?.managed ? roleID : null
				)[0];
		} else {
			languagePack = loadLanguagePack(DISCORD_DEFAULT_LANG);
			prefixToCheck = DISCORD_PREFIX;
		}
		prefixToCheck = prefixToCheck.toLowerCase();

		const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

		let prefixRegexStr = "^(";

		if (!DISCORD_PREFIX_MENTION_DISABLE) {
			// mention of integration role as prefix
			if (clientIntegrationRoleId) {
				prefixRegexStr += `<@&${clientIntegrationRoleId}>|`;
			}
			// mention as prefix
			prefixRegexStr += `<@!?${client.user.id}>|`;
		}

		// normal prefix
		prefixRegexStr += escapeRegex(prefixToCheck);
		prefixRegexStr += `)\\s*`

		const prefixRegex = new RegExp(prefixRegexStr);

		const commandRequested = content.toLowerCase(); // Case insensitive match
		const matchedPrefix = commandRequested.match(prefixRegex)?.[0];
		if (matchedPrefix == null) return;

		if (commandRequested.startsWith(matchedPrefix)) {
			commandsLoop: for (const command of commands) {
				for (const alias of command.aliases) {
					let commandAliasToCheck = matchedPrefix + alias.toLowerCase();

					if (commandRequested.startsWith(commandAliasToCheck)) {
						if (channel instanceof Eris.PrivateChannel && command.denyDm) {
							channel
								.createMessage(languagePack.functions.commandHandler.noDm)
								.catch(console.error);
							break commandsLoop;
						}

						if (
							channel instanceof Eris.GuildChannel &&
							(command as GuildChannelCommand).onlyAdmin &&
							!(await memberHasAdminPermission(message.member))
						) {
							channel
								.createMessage(languagePack.common.errorNoAdmin)
								.catch(console.error);
							break commandsLoop;
						}

						try {
							const guild =
								channel instanceof Eris.GuildChannel ? channel.guild : false;
							console.log(
								`${author.username}#${author.discriminator} (${author.id}) [${
									guild ? `Server: ${guild.name} (${guild.id}), ` : ``
								}Channel: ${channel.id}]: ${content}`
							);

							message.content = message.content.replace(prefixRegex, "");

							if (matchedPrefix.startsWith("<@&")) {
								message.roleMentions.shift();
							} else if (matchedPrefix.startsWith("<@")) {
								message.mentions.shift();
							}

							if (channel instanceof Eris.GuildChannel) {
								await (command as GuildChannelCommand).run({
									client,
									message: message as Message<GuildTextableChannel>,
									languagePack,
									guildService
								});
							} else {
								await (command as AnyChannelCommand).run({
									client,
									message,
									languagePack
								});
							}
						} catch (error) {
							commandErrorHandler(channel, languagePack, prefixToCheck, error);
						}
						break commandsLoop;
					}
				}
			}
		}
	}
};
