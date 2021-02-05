import MemberCounterCommand from "../typings/MemberCounterCommand";
import embedBase from "../utils/embedBase";
import GuildService from "../services/GuildService";
import getEnv from "../utils/getEnv";
import { GuildChannel } from "eris";
import CountService from "../services/CountService";
import Paginator from "../utils/paginator";
const { DISCORD_PREFIX } = getEnv();

const splitContent = (content: string): string[] => {
	const splitedStrings = content.split("\n");
	let result: string[] = [];

	splitedStrings.forEach((portion) => {
		const workingIndex = result.length - 1;
		if (
			result.length > 0 &&
			portion.length + result[workingIndex].length < 2000 - "\n".length
		) {
			result[workingIndex] = `${result[workingIndex]}\n${portion}`;
		} else {
			result.push(`${portion}\n`);
		}
	});

	return result;
};

const guide: MemberCounterCommand = {
	aliases: ["guide", "intro"],
	denyDm: false,
	onlyAdmin: false,
	run: async ({ message, languagePack }) => {
		const { channel, author } = message;
		const prefix = await (async () => {
			if (channel instanceof GuildChannel) {
				const guildSettings = await GuildService.init(channel.guild.id);
				return guildSettings.prefix;
			} else return DISCORD_PREFIX;
		})();

		const {
			explanation,
			countersHeader,
			counters: guideCounters,
			pagesText
		} = languagePack.commands.guide;

		const pages = [
			...splitContent(explanation),
			...splitContent(
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
		).displayPage("0");
	}
};

const guideCommand = [guide];

export default guideCommand;
