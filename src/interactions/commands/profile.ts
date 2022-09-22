import {
	ActionRowBuilder,
	ButtonBuilder,
	SlashCommandBuilder
} from "@discordjs/builders";
import { ButtonStyle, User } from "discord.js";

import config from "../../config";
import { ButtonIds, emojiBadges } from "../../Constants";
import UserService from "../../services/UserService";
import { Command } from "../../structures";
import { BaseMessageEmbed, UserError } from "../../utils";
import { emojiRegex } from "../modals/profile";

const generateBadgeList = (badges: number): string => {
	const hasBadge = (badgeN: number): boolean => (badges & badgeN) === badgeN;

	const badgeList = [];

	for (const [badge, emoji] of Object.entries(emojiBadges)) {
		if (emojiRegex.test(emoji as string)) {
			const badgeInt = Number(badge);
			if (hasBadge(badgeInt)) badgeList.push(emoji);
		}
	}

	badgeList.map((item, i) => {
		if (i % 2 === 0) return item + " ";
	});

	return "``` " + badgeList.join(" ") + " ```";
};

// TODO: remove warning for deleting
// TODO: maybe autoupdate embed when actions are performed

export const profileCommand = new Command<"profile">({
	name: "profile",
	definition: new SlashCommandBuilder()
		.setName("profile")
		.setDescription("untranslated")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("Select the user you want to view profile of")
		),
	execute: async (command, { t }) => {
		const { botOwners } = config;
		const {
			member: { user }
		} = command;

		const targetUser: User =
			(command.options.get("user")?.user as User) || (user as User);
		if (!(await UserService.exists(targetUser.id)))
			throw new UserError(t("commands.profile.userNotFound"));
		const userSettings = await UserService.init(targetUser.id);
		const Row = new ActionRowBuilder<ButtonBuilder>();
		if (botOwners.includes(user.id)) {
			Row.addComponents(
				new ButtonBuilder()
					.setLabel("Grant Server Upgrade")
					.setStyle(ButtonStyle.Primary)
					.setCustomId(ButtonIds.profileActions.grantServerUpgrade),
				new ButtonBuilder()
					.setLabel("Grant Credits")
					.setStyle(ButtonStyle.Primary)
					.setCustomId(ButtonIds.profileActions.grantCredits),
				new ButtonBuilder()
					.setLabel("Grant Badge")
					.setStyle(ButtonStyle.Primary)
					.setCustomId(ButtonIds.profileActions.grantBadge),
				new ButtonBuilder()
					.setLabel("Revoke Badge")
					.setStyle(ButtonStyle.Primary)
					.setCustomId(ButtonIds.profileActions.revokeBadge)
			);
		}

		const { badges, availableServerUpgrades, credits } = userSettings;

		const embed = new BaseMessageEmbed({
			author: {
				icon_url: targetUser.displayAvatarURL(),
				name: `${targetUser.username}#${targetUser.discriminator}`
			}
		});

		embed.addFields([
			{
				name: t("commands.profile.badges"),
				value: generateBadgeList(badges),
				inline: true
			},
			{
				name: t("commands.profile.serverUpgradesAvailable"),
				value: availableServerUpgrades.toString(10),
				inline: true
			},
			{
				name: t("commands.profile.credits"),
				value: credits.toString(10),
				inline: true
			}
		]);

		if (targetUser.id === user.id) {
			Row.addComponents(
				new ButtonBuilder()
					.setEmoji({ name: "🗑️" })
					.setLabel(t("commands.profile.buttons.deleteData.label"))
					.setStyle(ButtonStyle.Danger)
					.setCustomId(ButtonIds.deleteUserProfile)
			);
			embed.setDescription(
				t("commands.profile.removeDataConfirmation", {
					CANCEL_STRING: t("commands.profile.cancelString"),
					CONFIRMATION_STRING: t(
						"commands.profile.removeDataConfirmationString"
					),
					DELETE_DATA: t("commands.profile.buttons.deleteData.label")
				})
			);
			await command.reply({
				components: [Row],
				embeds: [embed],
				ephemeral: true
			});
		} else {
			await command.reply({
				components: [Row],
				embeds: [embed],
				ephemeral: true
			});
		}
	},
	// TODO: set the right intents and permissions
	neededPermissions: [],
	neededIntents: []
});
