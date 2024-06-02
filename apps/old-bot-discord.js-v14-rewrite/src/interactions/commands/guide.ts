import { SlashCommandBuilder } from "@discordjs/builders";
import counters from "../../counters/all";
import CountService from "../../services/CountService";

import { Command } from "../../structures";
import { BaseMessageEmbed, Paginator, safeDiscordString } from "../../utils";

export const guideCommand = new Command<"guide">({
	name: "guide",
	definition: new SlashCommandBuilder()
		.setName("guide")
		.setDescription("untranslated"),
	execute: async (command, { t }) => {
		const {
			explanation,
			countersHeader,
			counters: guideCounters
		} = t("commands.guide", { returnObjects: true });
		const pages = [
			// the actual guide
			...safeDiscordString(explanation),

			// the list of counters
			...safeDiscordString(
				countersHeader +
					Object.entries(guideCounters)
						.filter(
							([key]) =>
								CountService.getCounterByAlias(
									key as typeof counters[number]["aliases"][number],
									false
								).isEnabled
						)
						.map(([key, guideCounter]) => {
							const counter = CountService.getCounterByAlias(
								key as typeof counters[number]["aliases"][number],
								false
							);
							return `${counter.isPremium ? "+" : "-"} \`{${
								guideCounter.name
							}}\` ${guideCounter.description}`;
						})
						.join("\n")
			)
		];
		const embedPages = pages.map((page) =>
			new BaseMessageEmbed().setDescription(page)
		);
		new Paginator(command, embedPages, true).displayPage(0);
	},
	neededPermissions: [],
	neededIntents: []
});
