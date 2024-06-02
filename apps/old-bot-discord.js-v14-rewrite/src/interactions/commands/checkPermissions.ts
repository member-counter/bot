import { SlashCommandBuilder } from "@discordjs/builders";

import { allCommands } from ".";
import { Command } from "../../structures";
import {
	BaseMessageEmbed,
	Emojis,
	getBotInviteLink,
	Paginator,
	safeDiscordString
} from "../../utils";

// TODO: i18n
export const checkPermissionsCommand = new Command<"check-permissions">({
	name: "check-permissions",
	definition: new SlashCommandBuilder()
		.setName("check-permissions")
		.setDescription("untranslated"),
	execute: async (command, { t }) => {
		const { client, channel, guild } = command;
		const languagePackCheckPermissions = t("commands.check-permissions", {
			returnObjects: true
		});
		const botMemberPermissions = guild.members.cache.get(
			client.user.id
		).permissions;
		const canUseExternalEmojis = channel
			.permissionsFor(client.user.id)
			.has("UseExternalEmojis");
		const emojis = Emojis(canUseExternalEmojis);

		let messageBody = "";

		if (botMemberPermissions.has("Administrator")) {
			messageBody += `${emojis.warning} ${emojis.warning} ${emojis.warning} ${languagePackCheckPermissions.adminWarning} ${emojis.warning} ${emojis.warning} ${emojis.warning}\n\n`;
		}

		// TODO: get needed permissions from neededPermissions.ts and display only those with available translations
		messageBody += Array.from(
			new Set(allCommands.map((c) => c.neededPermissions).flat())
		)
			.map((permission) => {
				const { optional, name, description } =
					languagePackCheckPermissions.details[
						permission as unknown as
							| "ManageChannels"
							| "ViewChannel"
							| "Connect"
							| "ReadMessageHistory"
							| "SendMessages"
							| "EmbedLinks"
							| "AddReactions"
							| "ManageRoles"
							| "ManageMessages"
							| "BanMembers"
					];
				let sectionBody = "";

				if (botMemberPermissions.has(permission)) {
					sectionBody += emojis.confirm;
				} else if (optional) {
					sectionBody += emojis.warning;
				} else {
					sectionBody += emojis.negative;
				}

				sectionBody += ` **__${name}__** ${
					optional ? languagePackCheckPermissions.optionalText : ""
				}\n`;
				sectionBody += `${description}\n`;

				return sectionBody;
			})
			.join("\n");

		messageBody += "\n";
		messageBody += "\n";
		messageBody += languagePackCheckPermissions.footer;
		messageBody += "\n";

		const inviteLink = new URL(getBotInviteLink(guild.id));
		messageBody += inviteLink.toString();

		if (botMemberPermissions.has("EmbedLinks")) {
			const embeds = safeDiscordString(messageBody).map(
				(content) =>
					new BaseMessageEmbed({
						title: languagePackCheckPermissions.title,
						description: content
					})
			);
			new Paginator(command, embeds, true).displayPage(0);
		} else {
			safeDiscordString(messageBody).forEach((content) =>
				channel.send(content)
			);
		}
	},
	// TODO: set the right intents and permissions
	neededIntents: [
		"GuildMembers",
		"Guilds",
		"GuildBans",
		"GuildMessages",
		"DirectMessages",
		"GuildMessageReactions",
		"DirectMessageReactions"
	],
	neededPermissions: [
		"ManageChannels",
		"ViewChannel",
		"Connect",
		"ReadMessageHistory",
		"SendMessages",
		"EmbedLinks",
		"AddReactions",
		"ManageRoles",
		"ManageMessages",
		"BanMembers"
	]
});
