import Command from "../typings/Command";
import embedBase from "../utils/embedBase";
import getEnv from "../utils/getEnv";
import CountService from "../services/CountService";
import Paginator from "../utils/paginator";
import safeDiscordString from "../utils/safeDiscordString";
import { GuildChannel } from "eris";
import GuildService from "../services/GuildService";
const { DISCORD_PREFIX } = getEnv();

const guide: Command = {
	aliases: ["guide", "intro"],
	denyDm: false,
	run: async ({ message, languagePack }) => {
		const { channel } = message;

		let prefix = DISCORD_PREFIX;

		if (channel instanceof GuildChannel) {
			prefix = (await GuildService.init(message.guildID)).prefix;
		}

		const {
			explanation,
			countersHeader,
			counters: guideCounters
		} = languagePack.commands.guide;

		const pages = [
			// the actual guide
			...safeDiscordString(explanation),

			// the list of counters
			...safeDiscordString(
				countersHeader +
					guideCounters
						.filter(
							(guideCounter) =>
								CountService.getCounterByAlias(guideCounter.key).isEnabled
						)
						.map((guideCounter) => {
							const counter = CountService.getCounterByAlias(guideCounter.key);
							return `${counter.isPremium ? "*" : "-"} \`{${
								guideCounter.name
							}}\` ${guideCounter.description}`;
						})
						.join("\n")
			)
		].map((page) => page.replace(/\{PREFIX\}/g, prefix));

		const embedPages = [];
		pages.forEach((page) =>
			embedPages.push(
				embedBase({
					description: page
				})
			)
		);
		new Paginator(
			message.channel,
			message.author.id,
			embedPages,
			languagePack
		).displayPage(0);
	}
};

const guideCommand = [guide];

export default guideCommand;
