import Eris, { GuildTextableChannel, Message } from "eris";

import Bot from "../bot";
import commands from "../commands/all";
import GuildService from "../services/GuildService";
import UserService from "../services/UserService";
import { AnyChannelCommand, GuildChannelCommand } from "../typings/Command";
import LanguagePack from "../typings/LanguagePack";
import commandErrorHandler from "./commandErrorHandler";
import getEnv from "./getEnv";
import { loadLanguagePack } from "./languagePack";
import memberHasAdminPermission from "./memberHasAdminPermission";

const {
	PREMIUM_BOT,
	DISCORD_DEFAULT_LANG,
	DISCORD_OFFICIAL_SERVER_ID,
	GHOST_MODE,
	BOT_OWNERS
} = getEnv();

export default async (message: Eris.Message) => {
	if (GHOST_MODE && !BOT_OWNERS.includes(message.author?.id)) return;

	const { author, content } = message;
	let { channel } = message;
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
		// fetch dm channel
		if (!message.guildID) {
			message.channel = await message.author.getDMChannel();
			({ channel } = message);
		}

		let languagePack: LanguagePack;
		let clientIntegrationRoleId: string;
		let guildService: GuildService;

		// upsert the message author in the db
		await UserService.init(author.id);

		if (channel instanceof Eris.GuildChannel) {
			const { guild } = channel;

			guildService = await GuildService.init(guild.id);

			languagePack = loadLanguagePack(guildService.language);

			clientIntegrationRoleId = guild.members
				.get(client.user.id)
				?.roles.filter((roleID) =>
					guild.roles.get(roleID)?.managed ? roleID : null
				)[0];
		} else {
			languagePack = loadLanguagePack(DISCORD_DEFAULT_LANG);
		}

		let prefixRegexStr = "^(";

		// mention of integration role as prefix
		if (clientIntegrationRoleId) {
			prefixRegexStr += `<@&${clientIntegrationRoleId}>|`;
		}
		// mention as prefix
		prefixRegexStr += `<@!?${client.user.id}>|`;

		prefixRegexStr += `)\\s*`;

		const prefixRegex = new RegExp(prefixRegexStr, "i");

		const commandRequested = content.toLowerCase(); // Case insensitive match
		const matchedPrefix = commandRequested.match(prefixRegex)?.[0];
		if (matchedPrefix == null) return;
		if (!commandRequested.startsWith(matchedPrefix)) return;
		const commandRequestedWithoutPrefix = commandRequested
			.replace(matchedPrefix, "")
			.trim();
		const [commandName] = commandRequestedWithoutPrefix.split(" ");

		commandsLoop: for (const command of commands) {
			for (const alias of command.aliases) {
				if (commandName !== alias.toLowerCase()) {
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
						commandErrorHandler(channel, languagePack, error);
					}
					break commandsLoop;
				}
			}
		}
	}
};
