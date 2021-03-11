import Command from "../typings/Command";
import getEnv from "../utils/getEnv";
import embedBase from "../utils/embedBase";
import UserError from "../utils/UserError";

const { WEBSITE_URL, DISCORD_PREFIX, DISCORD_BOT_INVITE } = getEnv();

const help: Command = {
	aliases: ["help"],
	denyDm: false,
	run: async ({ message, languagePack, guildService }) => {
		const { channel, content } = message;
		const prefix = guildService?.prefix ?? DISCORD_PREFIX;

		let [, desiredCommand] = content.split(/\s+/g);

		if (!desiredCommand) {
			// Main help page
			let embed = embedBase(languagePack.commands.help.embedReply);

			embed.title = embed.title.replace(/\{PREFIX\}/g, prefix);
			embed.description = embed.description
				.replace(/\{DISCORD_BOT_INVITE\}/g, DISCORD_BOT_INVITE)
				.replace(/\{PREFIX\}/g, prefix)
				.replace(/\{WEBSITE\}/g, WEBSITE_URL);

			embed.fields.map((field) => {
				field.value = field.value.replace(/\{PREFIX\}/g, prefix);
				return field;
			});

			await channel.createMessage({ embed });
		} else {
			// Help for the specified command
			const { default: allcommands } = require("./all");
			const { commands } = languagePack;
			const aliascommand = allcommands.filter((cmd) =>
				cmd.aliases
					.map(function (value) {
						return value.toLowerCase();
					})
					.includes(desiredCommand.toLowerCase())
			)[0];
			let match;
			for (let command of Object.entries(commands)) {
				const [commandName, commandContent]: [string, any] = command;
				if (
					commandName.toLowerCase() === desiredCommand.toLowerCase() ||
					aliascommand?.aliases
						.map(function (value) {
							return value.toLowerCase();
						})
						.includes(commandName.toLowerCase())
				) {
					match = [commandName, commandContent];
				}
			}
			if (match) {
				const [commandName, commandContent] = match;
				const embed = embedBase({
					title: commands.help.misc.command + " " + commandName,
					description: commandContent.helpDescription.replace(
						/\{PREFIX\}/gi,
						prefix
					)
				});

				if (commandContent.helpImage) {
					embed.image = { url: commandContent.helpImage };
				}

				await channel.createMessage({ embed });
			} else {
				throw new UserError(
					languagePack.commands.help.misc.errorCommandNotFound.replace(
						"{DESIRED_COMMAND}",
						desiredCommand
					)
				);
			}
		}
	}
};

const helpCommands = [help];

export default helpCommands;
