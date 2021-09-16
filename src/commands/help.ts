import Command from "../typings/Command";
import getEnv from "../utils/getEnv";
import embedBase from "../utils/embedBase";
import UserError from "../utils/UserError";
import GuildService from "../services/GuildService";
import CountService from "../services/CountService";
import { GuildChannel } from "eris";
import getMotd from "../utils/getMOTD";
import commands from "../commands/all";
import counters from "../counters/all";
import { log } from "console";

const { WEBSITE_URL, DISCORD_PREFIX, DISCORD_BOT_INVITE } = getEnv();

const help: Command = {
	aliases: ["help"],
	denyDm: false,
	run: async ({ message, languagePack }) => {
		const { channel, content } = message;

		let prefix = DISCORD_PREFIX;

		if (channel instanceof GuildChannel) {
			prefix = (await GuildService.init(message.guildID)).prefix;
		}

		const desiredThing = content.replace(/\w+/, "").trim().toLowerCase();

		if (!desiredThing) {
			// Main help page
			let embed = embedBase(languagePack.commands.help.embedReply);

			embed.title = embed.title.replace(/\{PREFIX\}/g, prefix);
			const motd = getMotd();
			embed.description =
				(motd.length ? motd + "\n\n" : "") +
				embed.description
					.replace(/\{DISCORD_BOT_INVITE\}/g, DISCORD_BOT_INVITE)
					.replace(/\{PREFIX\}/g, prefix)
					.replace(/\{WEBSITE\}/g, WEBSITE_URL);

			embed.fields.map((field) => {
				field.value = field.value.replace(/\{PREFIX\}/g, prefix);
				return field;
			});

			await channel.createMessage({ embed });
		} else {
			// Help for the specified command or counter
			const commandMatch = commands.filter((cmd) =>
				cmd.aliases.map((alias) => alias.toLowerCase()).includes(desiredThing)
			)[0];
			const counterMatch = CountService.getCounterByAlias(
				desiredThing.replace(/\{|\}/g, "")
			);

			if (commandMatch) {
				for (const [key, content] of Object.entries(languagePack.commands)) {
					if (
						key.toLowerCase() === desiredThing ||
						commandMatch?.aliases
							.map((alias) => alias.toLowerCase())
							.includes(key.toLowerCase())
					) {
						const embed = embedBase({
							title: languagePack.commands.help.misc.command + ` \`${key}\``,
							description: content.helpDescription.replace(
								/\{PREFIX\}/gi,
								prefix
							)
						});

						if (content.helpImage) {
							embed.image = { url: content.helpImage };
						}

						await channel.createMessage({ embed });
						break;
					}
				}
			} else if (counterMatch) {
				for (const [key, content] of Object.entries(
					languagePack.commands.guide.counters
				)) {
					if (
						key.toLowerCase() === CountService.safeCounterName(desiredThing) ||
						counterMatch.aliases
							.map((alias) => alias.toLowerCase())
							.includes(key)
					) {

						const embed = embedBase({
							title: languagePack.commands.help.misc.counter + ` \`{${key}}\``,
							description: content.detailedDescription.replace(
								/\{PREFIX\}/gi,
								prefix
							)
						});
	
						embed.description += "\n";

						if (content.usage.length) {
							let usages = `\n**${languagePack.commands.guide.usageText}**\n`;
							content.usage.forEach(i => {
								usages += "```" + i + "```";
							});
							embed.description += usages;
						}

						if (content.example.length) {
							let examples = `\n**${languagePack.commands.guide.exampleText}**\n`;
							content.example.forEach(i => {
								examples += "```" + i + "```";
							});
							embed.description += examples;
						}

						await channel.createMessage({ embed });
						
						break;
					}
				}
			} else {
				throw new UserError(
					languagePack.commands.help.misc.errorNotFound.replace(
						"{DESIRED_COMMAND}",
						desiredThing
					)
				);
			}
		}
	}
};

const helpCommands = [help];

export default helpCommands;
