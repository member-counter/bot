import { SlashCommandBuilder } from "@discordjs/builders";
import { ChannelType, OverwriteType } from "discord-api-types/v10";
import {
	PermissionFlagsBits,
	PermissionsBitField,
	TextChannel
} from "discord.js";

import logger from "../../logger";
import CountService from "../../services/CountService";
import GuildSettings from "../../services/GuildSettings";
import { Command } from "../../structures";
import Emojis from "../../utils/emojis";
import { UserError } from "../../utils/UserError";

export const setupCommand = new Command({
	definition: new SlashCommandBuilder()
		.setName("setup")
		.setDescription("untranslated")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("type")
				.setAutocomplete(true)
				.setDescription(
					"Select the type of counters you want to setup (optional)"
				)
		)
		.addStringOption((option) =>
			option
				.setName("input")
				.setDescription(
					"Provide the following input: Twitch (channel name) Youtube (channel link) Twitter (account name)"
				)
		),

	execute: async (
		command, // eslint-disable-next-line
		{ t }
	) => {
		if (!command.inGuild()) throw new UserError("common.error.noDm");
		if (!command.memberPermissions.has(PermissionFlagsBits.Administrator))
			throw new UserError("common.error.noPermissions");
		const guildSettings = await GuildSettings.init(command.guildId);
		await command.guild.fetch();
		const guild = command.client.guilds.cache.get(command.guildId);
		const channel = guild.channels.cache.get(command.channelId) as TextChannel;
		const { client } = command;
		const type = command.options.get("type")
			? (command.options.get("type").value as "youtube" | "twitch" | "twitter")
			: ("default" as const);
		const resource = command.options.get("input")
			? (command.options.get("input").value as string)
			: null;
		const emojis = Emojis(
			command.appPermissions.has(PermissionFlagsBits.UseExternalEmojis)
		);
		const { categoryName: categoryNameTemplate, counters: countersToCreate } =
			t(`commands.setup.counterTemplates.${type}`);

		const countService = await CountService.init(guild);
		const counterStatus = new Map<string, "creating" | "created" | "error">();

		// throw error if type was specified but resource wasn't
		if (type && type !== "default" && !resource)
			throw new UserError(t("commands.setup.errorInvalidUsage"));
		const categoryName = resource
			? categoryNameTemplate.replace(/\{RESOURCE}/g, resource)
			: categoryNameTemplate;

		const categoryNameProcessed = await countService.processContent(
			categoryName
		);

		// populate counterStatus
		counterStatus.set("category", "creating");
		countersToCreate.forEach((counter) =>
			counterStatus.set(counter.name, "creating")
		);

		function buildStatusMessage() {
			const isCreating = [...counterStatus.values()].some(
				(c) => c === "creating"
			);
			const statusTexts = t("commands.setup.status");

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

		const statusMessage = await channel.send(buildStatusMessage());

		async function updateStatusMessage() {
			const newContent = buildStatusMessage();

			if (statusMessage.content !== newContent.trim()) {
				await statusMessage.edit(newContent).catch(logger.error);
			}
		}
		updateStatusMessage();
		PermissionFlagsBits;
		const discordCategory = await guild.channels.create({
			name: categoryNameProcessed,
			type: ChannelType.GuildCategory,
			permissionOverwrites: [
				{
					id: client.user.id,
					type: OverwriteType.Member,
					allow: new PermissionsBitField().add([
						PermissionFlagsBits.Connect,
						PermissionFlagsBits.ViewChannel
					])
				},
				{
					id: guild.id,
					type: OverwriteType.Role,
					deny: new PermissionsBitField().add([PermissionFlagsBits.Connect])
				}
			]
		});
		counterStatus.set("category", "created");
		await guildSettings.setCounter(discordCategory.id, categoryName);
		updateStatusMessage();

		for (const counter of countersToCreate) {
			if (type && resource) {
				counter.template = counter.template.replace(/\{RESOURCE}/g, resource);
			}

			guild.channels
				.create({
					name: await countService.processContent(counter.template),
					type: ChannelType.GuildVoice,
					permissionOverwrites: [
						{
							id: client.user.id,
							type: OverwriteType.Member,
							allow: new PermissionsBitField().add([
								PermissionFlagsBits.Connect,
								PermissionFlagsBits.ViewChannel
							])
						},
						{
							id: guild.id,
							type: OverwriteType.Role,
							deny: new PermissionsBitField().add([PermissionFlagsBits.Connect])
						}
					],
					parent: discordCategory.id
				})
				.then(async (channel) => {
					await guildSettings.setCounter(channel.id, counter.template);
					counterStatus.set(counter.name, "created");
					updateStatusMessage();
				})
				.catch((error) => {
					logger.error(error);
					counterStatus.set(counter.name, "error");
					updateStatusMessage();
				});
		}
	}
});
