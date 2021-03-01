import MemberCounterCommand from "../typings/MemberCounterCommand";
import CountService from "../services/CountService";
import { GuildChannel, PrivateChannel } from "eris";
import GuildService from "../services/GuildService";
import Bot from "../bot";
import emojis from "../utils/emojis";

const setup: MemberCounterCommand = {
	aliases: ["setup"],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, languagePack }) => {
		const { channel, content } = message;
		const { loading, checkMark } = emojis;
		const [, actionRequested, channelNameOrchannelUrl]: any[] = content.split(
			/\s+/
		);
		const canUseExternalEmojis = (() => {
			return (
				message.channel instanceof GuildChannel &&
				message.channel
					.permissionsOf(message.channel.client.user.id)
					.has("externalEmojis")
			);
		})();
		switch (typeof actionRequested) {
			case "string": {
				switch (actionRequested) {
					case "youtube": {
						let channelsToCreate = Object.keys(
							languagePack.commands.setup.counterTemplates.youtube
						).map((counter) => ({
							countTemplate: languagePack.commands.setup.counterTemplates.youtube[
								counter
							]["countTemplate"].replace(
								/\{CHANNEL_URL}/g,
								channelNameOrchannelUrl
							),
							creating: languagePack.commands.setup.counterTemplates.youtube[
								counter
							]["creating" + counter].replace(
								/{LOADING}/g,
								canUseExternalEmojis
									? loading.string
									: loading.fallbackUnicodeEmoji
							),
							created: languagePack.commands.setup.counterTemplates.youtube[
								counter
							]["created" + counter].replace(
								/{CHECK_MARK}/g,
								canUseExternalEmojis
									? checkMark.string
									: checkMark.fallbackUnicodeEmoji
							)
						}));

						if (channel instanceof GuildChannel) {
							const { client } = Bot;
							const { guild } = channel;
							const guildService = await GuildService.init(guild.id);
							const countService = await CountService.init(guild);
							const YouTubeCounter = CountService.getCounterByAlias(
								"youtubeSubscribers"
							);
							const { channelName }: any = await YouTubeCounter.execute({
								client,
								guild,
								guildSettings: guildService,
								aliasUsed: "youtubeSubscribers",
								resource: channelNameOrchannelUrl,
								formattingSettings: {
									locale: guildService.locale,
									digits: guildService.digits,
									shortNumber: guildService.shortNumber
								}
							});
							let str = "_ _\n";
							const categoryName = languagePack.commands.setup.categoryNames.youtube.categoryName.countTemplate.replace(
								/\{CHANNEL_NAME}/g,
								channelName
							);
							const msg = await channel.createMessage(
								languagePack.commands.setup.creatingCounts
							);
							str += languagePack.commands.setup.categoryNames.youtube.categoryName.creatingCategory.replace(
								/{LOADING}/g,
								canUseExternalEmojis
									? loading.string
									: loading.fallbackUnicodeEmoji
							);
							const category = await guild.createChannel(categoryName, 4, {
								permissionOverwrites: [
									{
										id: client.user.id,
										type: "member",
										allow: 0x00100000 | 0x00000400,
										deny: 0
									},
									{
										id: guild.id,
										type: "role",
										allow: 0,
										deny: 0x00100000
									}
								]
							});

							// Register category as a counter so it's removed when the user does mc!resetSettings
							guildService.setCounter(category.id, categoryName);
							msg.edit(str);
							str = str.replace(
								languagePack.commands.setup.categoryNames.youtube.categoryName.creatingCategory.replace(
									/{LOADING}/g,
									canUseExternalEmojis
										? loading.string
										: loading.fallbackUnicodeEmoji
								),
								languagePack.commands.setup.categoryNames.youtube.categoryName.createdCategory.replace(
									/{CHECK_MARK}/g,
									canUseExternalEmojis
										? checkMark.string
										: checkMark.fallbackUnicodeEmoji
								)
							);
							const categoryID = category.id;
							channelsToCreate.forEach(async (content) => {
								str += content.creating;
								msg.edit(str);
								guild
									.createChannel(
										await countService.processContent(content.countTemplate),
										2,
										{
											permissionOverwrites: [
												{
													id: client.user.id,
													type: "member",
													allow: 0x00100000 | 0x00000400,
													deny: 0
												},
												{
													id: guild.id,
													type: "role",
													allow: 0,
													deny: 0x00100000
												}
											],
											parentID: categoryID
										}
									)
									.then((channel) => {
										str = str.replace(content.creating, content.created);
										msg.edit(str);
										guildService.setCounter(channel.id, content.countTemplate);
									})
									.catch(guildService.log);
							});
							str += languagePack.commands.setup.createdCounts;
							msg.edit(str);

							break;
						}
					}
					case "twitch":
						{
							let channelsToCreate = Object.keys(
								languagePack.commands.setup.counterTemplates.twitch
							).map((counter) => ({
								countTemplate: languagePack.commands.setup.counterTemplates.twitch[
									counter
								]["countTemplate"].replace(
									/\{CHANNEL_NAME}/g,
									channelNameOrchannelUrl
								),
								creating: languagePack.commands.setup.counterTemplates.twitch[
									counter
								]["creating" + counter].replace(
									/{LOADING}/g,
									canUseExternalEmojis
										? loading.string
										: loading.fallbackUnicodeEmoji
								),
								created: languagePack.commands.setup.counterTemplates.twitch[
									counter
								]["created" + counter].replace(
									/{CHECK_MARK}/g,
									canUseExternalEmojis
										? checkMark.string
										: checkMark.fallbackUnicodeEmoji
								)
							}));

							if (channel instanceof GuildChannel) {
								const { client } = Bot;
								const { guild } = channel;
								const guildService = await GuildService.init(guild.id);
								const countService = await CountService.init(guild);
								let str = "_ _\n";
								const categoryName = languagePack.commands.setup.categoryNames.twitch.categoryName.countTemplate.replace(
									/\{CHANNEL_NAME}/g,
									channelNameOrchannelUrl
								);
								const msg = await channel.createMessage(
									languagePack.commands.setup.creatingCounts
								);
								str += languagePack.commands.setup.categoryNames.twitch.categoryName.creatingCategory.replace(
									/{LOADING}/g,
									canUseExternalEmojis
										? loading.string
										: loading.fallbackUnicodeEmoji
								);
								const category = await guild.createChannel(categoryName, 4, {
									permissionOverwrites: [
										{
											id: client.user.id,
											type: "member",
											allow: 0x00100000 | 0x00000400,
											deny: 0
										},
										{
											id: guild.id,
											type: "role",
											allow: 0,
											deny: 0x00100000
										}
									]
								});

								// Register category as a counter so it's removed when the user does mc!resetSettings
								guildService.setCounter(category.id, categoryName);
								msg.edit(str);
								str = str.replace(
									languagePack.commands.setup.categoryNames.twitch.categoryName.creatingCategory.replace(
										/{LOADING}/g,
										canUseExternalEmojis
											? loading.string
											: loading.fallbackUnicodeEmoji
									),
									languagePack.commands.setup.categoryNames.twitch.categoryName.createdCategory.replace(
										/{CHECK_MARK}/g,
										canUseExternalEmojis
											? checkMark.string
											: checkMark.fallbackUnicodeEmoji
									)
								);
								const categoryID = category.id;
								channelsToCreate.forEach(async (content) => {
									str += content.creating;
									msg.edit(str);
									guild
										.createChannel(
											await countService.processContent(content.countTemplate),
											2,
											{
												permissionOverwrites: [
													{
														id: client.user.id,
														type: "member",
														allow: 0x00100000 | 0x00000400,
														deny: 0
													},
													{
														id: guild.id,
														type: "role",
														allow: 0,
														deny: 0x00100000
													}
												],
												parentID: categoryID
											}
										)
										.then((channel) => {
											str = str.replace(content.creating, content.created);
											msg.edit(str);
											guildService.setCounter(
												channel.id,
												content.countTemplate
											);
										})
										.catch(guildService.log);
								});
								str += languagePack.commands.setup.createdCounts;
								msg.edit(str);
							}
						}

						break;
				}
				break;
			}
			case "undefined": {
				let channelsToCreate = Object.keys(
					languagePack.commands.setup.counterTemplates.counters
				).map((counter) => ({
					countTemplate:
						languagePack.commands.setup.counterTemplates.counters[counter][
							"countTemplate"
						],
					creating: languagePack.commands.setup.counterTemplates.counters[
						counter
					]["creating" + counter].replace(
						/{LOADING}/g,
						canUseExternalEmojis ? loading.string : loading.fallbackUnicodeEmoji
					),
					created: languagePack.commands.setup.counterTemplates.counters[
						counter
					]["created" + counter].replace(
						/{CHECK_MARK}/g,
						canUseExternalEmojis
							? checkMark.string
							: checkMark.fallbackUnicodeEmoji
					)
				}));

				if (channel instanceof GuildChannel) {
					const { client } = Bot;
					const { guild } = channel;
					const guildService = await GuildService.init(guild.id);
					const countService = await CountService.init(guild);
					let str = "_ _\n";
					const categoryName =
						languagePack.commands.setup.categoryNames.counters.categoryName
							.countTemplate;
					const msg = await channel.createMessage(
						languagePack.commands.setup.creatingCounts
					);
					str += languagePack.commands.setup.categoryNames.counters.categoryName.creatingCategory.replace(
						/{LOADING}/g,
						canUseExternalEmojis ? loading.string : loading.fallbackUnicodeEmoji
					);
					const category = await guild.createChannel(categoryName, 4, {
						permissionOverwrites: [
							{
								id: client.user.id,
								type: "member",
								allow: 0x00100000 | 0x00000400,
								deny: 0
							},
							{
								id: guild.id,
								type: "role",
								allow: 0,
								deny: 0x00100000
							}
						]
					});

					// Register category as a counter so it's removed when the user does mc!resetSettings
					guildService.setCounter(category.id, categoryName);
					msg.edit(str);
					str = str.replace(
						languagePack.commands.setup.categoryNames.counters.categoryName.creatingCategory.replace(
							/{LOADING}/g,
							canUseExternalEmojis
								? loading.string
								: loading.fallbackUnicodeEmoji
						),
						languagePack.commands.setup.categoryNames.counters.categoryName.createdCategory.replace(
							/{CHECK_MARK}/g,
							canUseExternalEmojis
								? checkMark.string
								: checkMark.fallbackUnicodeEmoji
						)
					);
					const categoryID = category.id;
					channelsToCreate.forEach(async (content) => {
						str += content.creating;
						msg.edit(str);
						guild
							.createChannel(
								await countService.processContent(content.countTemplate),
								2,
								{
									permissionOverwrites: [
										{
											id: client.user.id,
											type: "member",
											allow: 0x00100000 | 0x00000400,
											deny: 0
										},
										{
											id: guild.id,
											type: "role",
											allow: 0,
											deny: 0x00100000
										}
									],
									parentID: categoryID
								}
							)
							.then((channel) => {
								str = str.replace(content.creating, content.created);
								msg.edit(str);
								guildService.setCounter(channel.id, content.countTemplate);
							})
							.catch(guildService.log);
					});
					str += languagePack.commands.setup.createdCounts;
					msg.edit(str);
				}
			}
		}
	}
};

export default [setup];
