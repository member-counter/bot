import { SlashCommandBuilder } from "@discordjs/builders";
import { ChannelType, OverwriteType } from "discord-api-types/v10";
import {
	CommandInteraction,
	CommandInteractionOptionResolver,
	PermissionFlagsBits,
	PermissionsBitField
} from "discord.js";

import logger from "../../logger";
import CountService from "../../services/CountService";
import GuildSettings from "../../services/GuildSettings";
import { i18nService } from "../../services/i18n";
import { Command } from "../../structures";
import { Emojis, Unwrap, UserError } from "../../utils";

async function execute(
	command: CommandInteraction,
	{ t }: Unwrap<typeof i18nService>
) {
	if (!command.inGuild()) throw new UserError("common.error.noDm");
	if (!command.memberPermissions.has(PermissionFlagsBits.Administrator))
		throw new UserError("common.error.noPermissions");
	const guildSettings = await GuildSettings.init(command.guildId);
	await command.guild.fetch();
	await command.channel.fetch();

	const { client, guild } = command;
	const subcommand = (
		command.options as CommandInteractionOptionResolver
	).getSubcommand() as "youtube" | "twitch" | "twitter" | "server";
	const type = subcommand !== "server" ? subcommand : "default";
	function getOptionName(type: "youtube" | "twitch" | "twitter") {
		switch (type) {
			case "youtube": {
				return "channel-url";
			}
			case "twitch": {
				return "channel-name";
			}
			case "twitter": {
				return "account-name";
			}
		}
	}
	const resource =
		type !== "default"
			? (command.options.get(getOptionName(type)).value as string)
			: null;
	const emojis = Emojis(
		command.appPermissions.has(PermissionFlagsBits.UseExternalEmojis)
	);

	const { categoryName: categoryNameTemplate, counters: countersToCreate } = t(
		`commands.setup.counterTemplates.${type}`,
		{
			returnObjects: true
		}
	);

	const countService = await CountService.init(guild, command);
	const counterStatus = new Map<string, "creating" | "created" | "error">();

	const categoryName = resource
		? categoryNameTemplate.replace(/\{RESOURCE}/g, resource)
		: categoryNameTemplate;

	const categoryNameProcessed = await countService.processContent(categoryName);

	// populate counterStatus
	counterStatus.set("category", "creating");
	countersToCreate.forEach((counter: { name: string; template: string }) =>
		counterStatus.set(counter.name, "creating")
	);

	function buildStatusMessage() {
		const isCreating = [...counterStatus.values()].some(
			(c) => c === "creating"
		);
		const statusTexts = t("commands.setup.status", { returnObjects: true });

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
	await command.reply({ content: buildStatusMessage(), ephemeral: true });
	const statusMessage = await command.fetchReply();

	async function updateStatusMessage() {
		const newContent = buildStatusMessage();

		if (statusMessage.content !== newContent.trim()) {
			command
				.editReply({
					content: newContent
				})
				.catch(logger.error);
		}
	}
	updateStatusMessage();
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
			counter.template = counter.template.replace(
				/\{RESOURCE}/g,
				resource
			) as typeof counter.template;
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
export const setupCommand = new Command({
	definition: new SlashCommandBuilder()
		.setName("setup")
		.setDescription("untranslated")
		.setDMPermission(false)
		.addSubcommand((subCommand) =>
			subCommand
				.setName("server")
				.setDescription("Used to setup server related counters")
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName("twitch")
				.setDescription("Used to setup twitch counters")
				.addStringOption((option) =>
					option
						.setName("channel-name")
						.setDescription(
							"Please provide the following input: Twitch channel name"
						)
						.setRequired(true)
				)
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName("twitter")
				.setDescription("Used to setup twitter counters")
				.addStringOption((option) =>
					option
						.setName("account-name")
						.setDescription(
							"Please provide the following input: Twitter account name"
						)
						.setRequired(true)
				)
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName("youtube")
				.setDescription("Used to setup youtube counters")
				.addStringOption((option) =>
					option
						.setName("channel-url")
						.setDescription(
							"Please provide the following input: YouTube channel link"
						)
						.setRequired(true)
				)
		),
	execute: {
		server: execute,
		twitch: execute,
		youtube: execute,
		twitter: execute
	},
	// TODO: set the right intents and permissions
	neededIntents: [
		"GuildMessageTyping",
		"GuildMembers",
		"GuildEmojisAndStickers",
		"Guilds"
	],
	neededPermissions: [
		"Connect",
		"ManageRoles",
		"SendMessages",
		"ManageChannels",
		"ViewChannel"
	]
});
