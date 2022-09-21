import {
	ActionRowBuilder,
	ButtonBuilder,
	SlashCommandBuilder
} from "@discordjs/builders";
import { ButtonStyle, User } from "discord.js";

import config from "../../config";
import { UserBadges } from "../../Constants";
import UserService from "../../services/UserService";
import { Command } from "../../structures";
import { BaseMessageEmbed, UserError } from "../../utils";

const emojiBadges = {
	[UserBadges.DONOR]: "❤️",
	[UserBadges.PREMIUM]: "💎",
	[UserBadges.BETA_TESTER]: "🧪",
	[UserBadges.TRANSLATOR]: "🌎",
	[UserBadges.CONTRIBUTOR]: "💻",
	[UserBadges.BIG_BRAIN]: "🧠",
	[UserBadges.BUG_CATCHER]: "🐛",
	[UserBadges.PATPAT]: "🐱",
	[UserBadges.FOLDING_AT_HOME]: "🧬"
};

const generateBadgeList = (badges: number): string => {
	const hasBadge = (badgeN: number): boolean => (badges & badgeN) === badgeN;

	const badgeList = [];

	for (const [badge, emoji] of Object.entries(emojiBadges)) {
		const badgeInt = Number(badge);
		if (hasBadge(badgeInt)) badgeList.push(emoji);
	}

	badgeList.map((item, i) => {
		if (i % 2 === 0) return item + " ";
	});

	return "``` " + badgeList.join(" ") + " ```";
};
export const profileCommand = new Command({
	definition: new SlashCommandBuilder()
		.setName("profile")
		.setDescription("untranslated")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("Select the user you want to view profile of")
		)
		.addStringOption((option) =>
			option
				.setName("action")
				.setDescription("Used to perform bot admin actions on users")
				.setAutocomplete(true)
		)
		.addNumberOption((option) =>
			option.setName("param").setDescription("Number")
		),
	execute: async (command, { t }) => {
		const { botOwners } = config;
		const {
			member: { user }
		} = command;

		const targetUser: User =
			(command.options.get("user")?.user as User) || (user as User);
		const actionRequested = command.options.get("action")?.value ?? null;
		const actionParam = command.options.get("param")?.value ?? null;
		if (!actionRequested && !(await UserService.exists(targetUser.id)))
			throw new UserError(t("commands.profile.userNotFound"));
		const userSettings = await UserService.init(targetUser.id);

		if (actionRequested && botOwners.includes(user.id)) {
			switch (actionRequested as string) {
				case "grantcredit": {
					await userSettings.grantCredits(
						parseInt(actionParam as string, 10) || 1
					);
					break;
				}

				case "grantserverupgrade": {
					await userSettings.grantAvailableServerUpgrades(
						parseInt(actionParam as string, 10) || 1
					);
					break;
				}

				case "grantbadge": {
					await userSettings.grantBadge(parseInt(actionParam as string, 2));
					break;
				}

				case "revokebadge": {
					await userSettings.revokeBadge(parseInt(actionParam as string, 2));
					break;
				}

				default: {
					// TODO: await message.addReaction("❓");
					break;
				}
			}
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
			const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setEmoji({ name: "🗑️" })
					.setLabel(t("commands.profile.buttons.deleteData.label"))
					.setStyle(ButtonStyle.Danger)
					.setCustomId("delete_user_profile")
			);
			await command.reply({
				components: [row],
				embeds: [embed],
				ephemeral: true
			});
		} else {
			await command.reply({
				embeds: [embed],
				ephemeral: true
			});
		}
	},
	neededPermissions: [],
	neededIntents: []
});
