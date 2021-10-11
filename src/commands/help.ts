import Command from "../typings/Command";
import getEnv from "../utils/getEnv";
import embedBase from "../utils/embedBase";
import UserError from "../utils/UserError";
import GuildService from "../services/GuildService";
import CountService from "../services/CountService";
import { GuildChannel } from "eris";
import getMotd from "../utils/getMOTD";
import commands from "../commands/all";
import escapeRegex from "../utils/escapeRegex";

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

		const desiredThing = content
			.replace(/\w+/, "")
			.trim()
			.toLowerCase()
			.replace(/\{|\}/g, "")
			.replace(new RegExp(`^${escapeRegex(prefix)}`), "");

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

			await channel.createMessage({ embeds: [embed] });
		} else {
			// Help for the specified command or counter
			const commandMatch = commands.filter((cmd) =>
				cmd.aliases.map((alias) => alias.toLowerCase()).includes(desiredThing)
			)[0];
			const counterMatch = CountService.getCounterByAlias(desiredThing);

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

						embed.description += "\n";

						if (content.helpUsage?.length) {
							let usages = `\n**${languagePack.commands.help.misc.usageText}**\n`;
							content.helpUsage.forEach((i) => {
								usages += "```" + i + "```";
							});
							embed.description += usages.replace(/\{PREFIX\}/gi, prefix);
						}

						if (content.helpExample?.length) {
							let examples = `\n**${languagePack.commands.help.misc.exampleText}**\n`;
							content.helpExample.forEach((i) => {
								examples += "```" + i + "```";
							});
							embed.description += examples.replace(/\{PREFIX\}/gi, prefix);
						}

						if (content.helpImage) {
							embed.image = { url: content.helpImage };
						}

						embed.description +=
							"\n> " + languagePack.commands.help.helpFooterText;

						await channel.createMessage({ embeds: [embed] });
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

						if (content.usage?.length) {
							let usages = `\n**${languagePack.commands.help.misc.usageText}**\n`;
							content.usage.forEach((i) => {
								usages += "```" + i + "```";
							});
							embed.description += usages;
						}

						if (content.example?.length) {
							let examples = `\n**${languagePack.commands.help.misc.exampleText}**\n`;
							content.example.forEach((i) => {
								examples += "```" + i + "```";
							});
							embed.description += examples;
						}

						embed.description +=
							"\n> " +
							languagePack.commands.guide.footerText.replace(
								/\{PREFIX\}/gi,
								prefix
							);

						await channel.createMessage({ embeds: [embed] });

						break;
					}
				}
			} else {
				// If nothing was found, suggest stuff
				const searchIgnoredWords = languagePack.commands.help.misc.searchIgnoredWords
					.normalize("NFD")
					.toLowerCase()
					.replace(/\p{Diacritic}/gu, "")
					.split(/\s+/);

				const keywords = desiredThing
					.normalize("NFD")
					.toLowerCase()
					.replace(/\p{Diacritic}/gu, "")
					.split(/\s+|\n+/);

				console.log();

				const bestCounterOccurrences = new Map<string, number>();
				const bestCommandOccurrences = new Map<string, number>();

				function search(text: string, map: Map<string, number>, key: string) {
					text.split(/\s+|\n+/).forEach((word) =>
						keywords.forEach((keyword) => {
							const wordLC = word.toLowerCase();
							if (
								(keyword.startsWith(wordLC) || wordLC.startsWith(keyword)) &&
								!searchIgnoredWords.some((ignoreWord) =>
									wordLC.startsWith(ignoreWord)
								)
							) {
								let count = map.get(key) ?? 0;
								count++;
								map.set(key, count);
							}
						})
					);
				}

				for (const [key, counterLP] of Object.entries(
					languagePack.commands.guide.counters
				)) {
					search(counterLP.description, bestCounterOccurrences, key);
					search(counterLP.detailedDescription, bestCounterOccurrences, key);
				}

				for (const [key, commandLP] of Object.entries(languagePack.commands)) {
					if ("helpDescription" in commandLP)
						search(commandLP.helpDescription, bestCommandOccurrences, key);
				}

				let errorMessage = languagePack.commands.help.misc.errorNotFound.replace(
					"{DESIRED_COMMAND}",
					desiredThing
				);

				if (bestCounterOccurrences.size) {
					errorMessage += "\n";
					errorMessage += "\n";
					errorMessage += languagePack.commands.help.misc.suggestCounter;
					errorMessage += "\n";

					Array.from(bestCounterOccurrences)
						.sort((a, b) => b[1] - a[1])
						.slice(0, 10)
						.forEach(([counterKey]) => {
							const counter = CountService.getCounterByAlias(counterKey);

							errorMessage += `${
								counter.isPremium ? "+" : "-"
							} \`{${counterKey}}\` ${
								languagePack.commands.guide.counters[counterKey].description
							}`;
							errorMessage += "\n";
						});
				}

				if (bestCommandOccurrences.size) {
					errorMessage += "\n";
					errorMessage += "\n";
					errorMessage += languagePack.commands.help.misc.suggestCommand;
					errorMessage += "\n";

					Array.from(bestCommandOccurrences)
						.sort((a, b) => b[1] - a[1])
						.slice(0, 5)
						.forEach(([key]) => {
							const command = languagePack.commands[key];

							errorMessage += `- \`${prefix}${key}\` ${
								command?.helpDescription?.slice(0, 50) ?? ""
							}...`;
							errorMessage += "\n";
						});
				}

				throw new UserError(errorMessage);
			}
		}
	}
};

const helpCommands = [help];

export default helpCommands;
