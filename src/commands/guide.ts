import Command from "../typings/Command";
import embedBase from "../utils/embedBase";
import getEnv from "../utils/getEnv";
import CountService from "../services/CountService";
import Paginator from "../utils/paginator";
import safeDiscordString from "../utils/safeDiscordString";

const guide: Command = {
	aliases: ["guide", "intro"],
	denyDm: false,
	run: async ({ message, languagePack }) => {
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
					Object.entries(guideCounters)
						.filter(([key]) => CountService.getCounterByAlias(key).isEnabled)
						.map(([key, guideCounter]) => {
							const counter = CountService.getCounterByAlias(key);
							return `- ${counter.isPremium ? "*" : ""}\`{${
								guideCounter.name
							}}\` ${guideCounter.description}`;
						})
						.join("\n")
			)
		];

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
