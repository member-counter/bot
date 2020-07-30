import MemberCounterCommand from '../typings/MemberCounterCommand';
import UserError from '../utils/UserError';
import CountService from '../services/CountService';
import { GuildChannel } from 'eris';
import GuildService from '../services/GuildService';

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
			const { guild } = channel;
			const guildService = await GuildService.init(guild.id);
			const countService = await CountService.init(guild);

			channelsToCreate.forEach(async (content) => {
				guild
					.createChannel(
						await countService.processContent(content),
						2,
						{
							permissionOverwrites: [
								{
									id: channel.client.user.id,
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
