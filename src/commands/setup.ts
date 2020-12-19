import MemberCounterCommand from '../typings/MemberCounterCommand';
import CountService from '../services/CountService';
import { GuildChannel } from 'eris';
import GuildService from '../services/GuildService';
import Bot from '../bot';

const setup: MemberCounterCommand = {
	aliases: ['setup'],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, languagePack }) => {
		const { channel, content } = message;

		let channelsToCreate = [
			languagePack.commands.setup.memberCounter,
			languagePack.commands.setup.boostingCounter,
			languagePack.commands.setup.rolesCounter,
			languagePack.commands.setup.channelsCounter,
		];

		if (channel instanceof GuildChannel) {
			const { client } = Bot;
			const { guild } = channel;
			const guildService = await GuildService.init(guild.id);
			const countService = await CountService.init(guild);
			const categoryName = languagePack.commands.setup.categoryName
			const category = await guild.createChannel(categoryName, 4, {
				permissionOverwrites: [
						{
								id: client.user.id,
								type: 'member',
								allow: 0x00100000 | 0x00000400,
								deny: 0,
						},
						{
								id: guild.id,
								type: 'role',
								allow: 0,
								deny: 0x00100000,
						},
				],
		})
		const categoryID = category.id;
			channelsToCreate.forEach(async (content) => {
				guild
					.createChannel(
						await countService.processContent(content),
						2,
						{
							permissionOverwrites: [
								{
									id: client.user.id,
									type: 'member',
									allow: 0x00100000 | 0x00000400,
									deny: 0,
								},
								{
									id: guild.id,
									type: 'role',
									allow: 0,
									deny: 0x00100000,
								},
							],
							parentID: categoryID
						},
					)
					.then((channel) => {
						guildService.setCounter(channel.id, content);
					})
					.catch(guildService.log);
			});
		}
	},
};

export default [setup];
