import Command from "../typings/Command";
import CountService from "../services/CountService";
import Emojis from "../utils/emojis";
import Eris from "eris";
import UserError from "../utils/UserError";

const setup: Command = {
	aliases: ["setup"],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, languagePack, guildService, client }) => {
		const availableSetups = ["youtube", "twitch", "twitter"];
		const { channel, content } = message;
		let [, type, resource]: (string | undefined)[] = content.split(/\s+/);

		const canUseExternalEmojis = channel
			.permissionsOf(message.channel.client.user.id)
			.has("externalEmojis");
		const emojis = Emojis(canUseExternalEmojis);
		// use default if type is invalid
		if (type && !availableSetups.includes(type)) type = "default";

		const {
			categoryName: catergoryNameTemplate,
			counters: countersToCreate
		} = languagePack.commands.setup.counterTemplates[
			(type as "youtube" | "twitch" | "twitter") ?? "default"
		];

		const { guild } = channel;
		const countService = await CountService.init(guild);
		const counterStatus = new Map<string, "creating" | "created" | "error">();
		let categoryName: string;
		let categoryNameProcessed: string;

		// throw error if type was specified but resource wasn't
		if (type && !resource)
			throw new UserError(languagePack.commands.setup.errorInvalidUsage);

		categoryName = resource
			? catergoryNameTemplate.replace(/\{RESOURCE}/g, resource)
			: catergoryNameTemplate;

		categoryNameProcessed = await countService.processContent(categoryName);

		// populate counterStatus
		counterStatus.set("category", "creating");
		countersToCreate.forEach((counter) =>
			counterStatus.set(counter.name, "creating")
		);

		function buildStatusMessage() {
			const isCreating = [...counterStatus.values()].some(
				(c) => c === "creating"
			);
			const statusTexts = languagePack.commands.setup.status;

			let msg = "";

			if (isCreating) {
				msg += statusTexts.creatingCounts + "\n";
			} else {
				msg += "_ _\n";
			}

			const categoryStatus = counterStatus.get("category");
			if (categoryStatus === "creating") {
				msg +=
					statusTexts.creatingCategory.replace(
						/{LOADING}/g,
						emojis.loading.toString()
					) + "\n";
			} else if (categoryStatus === "created") {
				msg +=
					statusTexts.createdCategory.replace(
						/{CHECK_MARK}/g,
						emojis.checkMark.toString()
					) + "\n";
			} else {
				msg +=
					statusTexts.createdCategory.replace(
						/{CHECK_MARK}/g,
						emojis.error.toString()
					) + "\n";
			}

			countersToCreate.forEach((counter) => {
				const status = counterStatus.get(counter.name);
				if (status === "creating") {
					msg +=
						counter.statusCreating.replace(
							/{LOADING}/g,
							emojis.loading.toString()
						) + "\n";
				} else if (status === "created") {
					msg +=
						counter.statusCreated.replace(
							/{CHECK_MARK}/g,
							emojis.checkMark.toString()
						) + "\n";
				} else {
					msg +=
						counter.statusCreated.replace(
							/{CHECK_MARK}/g,
							emojis.error.toString()
						) + "\n";
				}
			});

			if (!isCreating) {
				msg += statusTexts.createdCounts + "\n";
			} else {
				msg += "_ _\n";
			}

			return msg;
		}

		const statusMessage = await channel.createMessage(buildStatusMessage());

		async function updateStatusMessage() {
			const newContent = buildStatusMessage();

			if (statusMessage.content !== newContent.trim()) {
				await statusMessage.edit(newContent).catch(console.error);
			}
		}
		updateStatusMessage();

		const discordCategory = await guild.createChannel(
			categoryNameProcessed,
			Eris.Constants.ChannelTypes.GUILD_CATEGORY,
			{
				permissionOverwrites: [
					{
						id: client.user.id,

						// TODO use constants when abalabahaha/eris#1271 is merged
						type: 1,
						allow:
							Eris.Constants.Permissions.voiceConnect |
							Eris.Constants.Permissions.viewChannel,
						deny: 0
					},
					{
						id: guild.id,
						// TODO use constants when abalabahaha/eris#1271 is merged
						type: 0,
						allow: 0,
						deny: Eris.Constants.Permissions.voiceConnect
					}
				]
			}
		);
		counterStatus.set("category", "created");
		await guildService.setCounter(discordCategory.id, categoryName);
		updateStatusMessage();

		for (const counter of countersToCreate) {
			if (type && resource) {
				counter.template = counter.template.replace(/\{RESOURCE}/g, resource);
			}

			guild
				.createChannel(
					await countService.processContent(counter.template),
					Eris.Constants.ChannelTypes.GUILD_VOICE,
					{
						permissionOverwrites: [
							{
								id: client.user.id,

								// TODO use constants when abalabahaha/eris#1271 is merged
								type: 1,
								allow:
									Eris.Constants.Permissions.voiceConnect |
									Eris.Constants.Permissions.viewChannel,
								deny: 0
							},
							{
								id: guild.id,

								// TODO use constants when abalabahaha/eris#1271 is merged
								type: 0,
								allow: 0,
								deny:
									Eris.Constants.Permissions.voiceConnect
							}
						],
						parentID: discordCategory.id
					}
				)
				.then(async (channel) => {
					await guildService.setCounter(channel.id, counter.template);
					counterStatus.set(counter.name, "created");
					updateStatusMessage();
				})
				.catch((error) => {
					console.error(error);
					counterStatus.set(counter.name, "error");
					updateStatusMessage();
				});
		}
	}
};

export default [setup];
