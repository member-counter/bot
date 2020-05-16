import MemberCounterCommand from '../typings/MemberCounterCommand';
import ReactionManager from '../utils/ReactionManager';
import embedBase from '../utils/embedBase';
import GuildService from '../services/GuildService';
import getEnv from '../utils/getEnv';
import { GuildChannel } from 'eris';

const { DISCORD_PREFIX } = getEnv();

const splitContent = (content: string): string[] => {
	const splitedStrings = content.split('\n');
	let result: string[] = [];

	splitedStrings.forEach((portion) => {
		const workingIndex = result.length - 1;
		if (
			result.length > 0 &&
			portion.length + result[workingIndex].length < 2000 - '\n'.length
		) {
			result[workingIndex] = `${result[workingIndex]}\n${portion}`;
		} else {
			result.push(`${portion}\n`);
		}
	});

	return result;
};

const guide: MemberCounterCommand = {
	aliases: ['guide', 'setup', 'intro'],
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

		const { explanation, counters, pagesText } = languagePack.commands.setup;
		const pages = [
			...splitContent(explanation),
			...splitContent(counters),
		].map((page) => page.replace(/\{PREFIX\}/g, prefix));
		let currentPage = 0;

		const embed = embedBase({
			description: pages[currentPage],
			footer: {
				text: pagesText
					.replace('{CURRENT_PAGE}', currentPage + 1)
					.replace('{TOTAL_PAGES}', pages.length),
			},
		});

		const guideMessage = await channel.createMessage({ embed });

		await Promise.all([
			await guideMessage.addReaction('◀️'),
			await guideMessage.addReaction('▶️'),
		]);

		ReactionManager.addReactionListener({
			message: guideMessage,
			emoji: '◀️',
			autoDestroy: 30 * 60 * 1000,
			callback: (userId) => {
				if (userId !== author.id) return;
				if (currentPage > 0) --currentPage;
				embed.description = pages[currentPage];
				embed.footer = {
					text: pagesText
						.replace('{CURRENT_PAGE}', currentPage + 1)
						.replace('{TOTAL_PAGES}', pages.length),
				};
				guideMessage.edit({ embed }).catch(console.error);
			},
		});

		ReactionManager.addReactionListener({
			message: guideMessage,
			emoji: '▶️',
			autoDestroy: 30 * 60 * 1000,
			callback: (userId) => {
				if (userId !== author.id) return;
				if (currentPage < pages.length - 1) ++currentPage;
				embed.description = pages[currentPage];
				embed.footer = {
					text: pagesText
						.replace('{CURRENT_PAGE}', currentPage + 1)
						.replace('{TOTAL_PAGES}', pages.length),
				};
				guideMessage.edit({ embed }).catch(console.error);
			},
		});
	},
};

const guideCommand = [guide];

export default guideCommand;
