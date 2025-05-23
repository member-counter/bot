import { randomUUID } from "crypto";
import type { InteractionEditReplyOptions, User } from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
} from "@discordjs/builders";
import { ApplicationCommandType, ButtonStyle, ComponentType } from "discord.js";

import { BitField } from "@mc/common/BitField";
import { prepareLocalization } from "@mc/common/bot/i18n/prepareLocalization";
import { Command } from "@mc/common/bot/structures/Command";
import { KnownError } from "@mc/common/KnownError/index";
import { Routes } from "@mc/common/Routes";
import {
  UserBadges,
  UserBadgesBitfield,
  UserBadgesEmoji,
} from "@mc/common/UserBadges";
import { UserPermissions } from "@mc/common/UserPermissions";
import { NotFoundError } from "@mc/db";
import { UserSettingsService } from "@mc/services/userSettings";

import { env } from "~/env";
import { BaseEmbed } from "~/utils/BaseMessageEmbed";
import { throwUnsupported } from ".";

const generateBadgeList = (badges: bigint): string => {
  const hasBadge = (badgeN: bigint): boolean => (badges & badgeN) === badgeN;

  const badgeList: string[] = [];

  UserBadges.forEach((badge) => {
    const badgeInt = UserBadgesBitfield[badge];
    if (hasBadge(badgeInt)) badgeList.push(UserBadgesEmoji[badge]);
  });

  return "``` " + badgeList.join(" ") + " ```";
};

export const profileCommand = new Command({
  slashDefinition: new SlashCommandBuilder()
    .setName(
      prepareLocalization("interaction.commands.profile.definition.slash.name"),
    )
    .setDescription(
      prepareLocalization(
        "interaction.commands.profile.definition.slash.description",
      ),
    )
    .addUserOption((option) =>
      option
        .setName(
          prepareLocalization(
            "interaction.commands.profile.definition.slash.options.user.name",
          ),
        )
        .setDescription(
          prepareLocalization(
            "interaction.commands.profile.definition.slash.options.user.description",
          ),
        ),
    ),
  contextDefinition: new ContextMenuCommandBuilder()
    .setName(
      prepareLocalization(
        "interaction.commands.profile.definition.context.name",
      ),
    )
    .setType(ApplicationCommandType.User),
  handle: async (command, { t }) => {
    let targetUser: User;

    if (command.isUserContextMenuCommand()) {
      targetUser = command.targetUser;
    } else if (command.isChatInputCommand()) {
      targetUser = command.options.getUser("user") ?? command.user;
    } else {
      targetUser = null as never;
      throwUnsupported(command);
    }

    const userSettings = await UserSettingsService.upsert(command.user.id);
    const userPermissions = new BitField(userSettings.permissions);

    const requestedUserSettings = await UserSettingsService.get(
      targetUser.id,
    ).catch((error) => {
      if (error instanceof NotFoundError) {
        throw new KnownError("USER_NOT_FOUND");
      }
      throw error;
    });

    const deleteProfileButtonId = randomUUID();
    const deleteProfilePromptConfirm = randomUUID();
    const deleteProfilePromptCancel = randomUUID();

    function renderBaseEmbed() {
      return new BaseEmbed(command.client, {
        author: {
          icon_url: targetUser.displayAvatarURL(),
          name: `${targetUser.username}${targetUser.discriminator !== "0" ? `#${targetUser.discriminator}` : ""}`,
        },
      });
    }

    function renderProfileView(): InteractionEditReplyOptions {
      const embed = renderBaseEmbed();

      embed.addFields([
        {
          name: t("interaction.commands.profile.badges"),
          value: generateBadgeList(requestedUserSettings.badges),
          inline: false,
        },
      ]);

      let row: ActionRowBuilder<ButtonBuilder> | null = null;
      if (
        targetUser.id === command.user.id ||
        userPermissions.any(UserPermissions.ManageUsers)
      ) {
        row ??= new ActionRowBuilder();
        row.addComponents(
          new ButtonBuilder()
            .setEmoji({ name: "🗑️" })
            .setCustomId(deleteProfileButtonId)
            .setLabel(t("interaction.commands.profile.deleteProfileButton"))
            .setStyle(ButtonStyle.Danger),
        );
      }

      if (
        userPermissions.any(
          UserPermissions.ManageUsers | UserPermissions.SeeUsers,
        )
      ) {
        row ??= new ActionRowBuilder();
        row.addComponents(
          new ButtonBuilder()
            .setEmoji({ name: "⚙️" })
            .setLabel(t("interaction.commands.profile.moreOptionsButton"))
            .setStyle(ButtonStyle.Link)
            .setURL(Routes(env.WEBSITE_URL).ManageUsers(targetUser.id)),
        );
      }

      return {
        components: [row].filter(Boolean),
        embeds: [embed],
      };
    }

    function renderProfileDeletionPrompt(): InteractionEditReplyOptions {
      const embed = renderBaseEmbed();

      embed.setTitle(
        t("interaction.commands.profile.deleteProfilePrompt.title"),
      );
      embed.setDescription(
        t("interaction.commands.profile.deleteProfilePrompt.description"),
      );

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(deleteProfilePromptConfirm)
          .setLabel(
            t("interaction.commands.profile.deleteProfilePrompt.confirmButton"),
          )
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(deleteProfilePromptCancel)
          .setLabel(
            t("interaction.commands.profile.deleteProfilePrompt.cancelButton"),
          )
          .setStyle(ButtonStyle.Primary),
      );
      return {
        components: [row].filter(Boolean),
        embeds: [embed],
      };
    }

    function renderProfileDeletionSuccess(): InteractionEditReplyOptions {
      return {
        content: t(
          "interaction.commands.profile.deleteProfilePrompt.removeDataSuccess",
        ),
        components: [],
        embeds: [],
      };
    }

    async function editReply(editOptions: InteractionEditReplyOptions) {
      const response = await command.editReply(editOptions);

      if (!editOptions.components?.length) return;
      await response
        .awaitMessageComponent({
          time: 60_000 * 5,
          idle: 60_000 * 5,
          componentType: ComponentType.Button,
          filter: (i) => i.user.id === command.user.id,
        })
        .then(async (interaction) => {
          await interaction.deferUpdate();
          switch (interaction.customId) {
            case deleteProfileButtonId:
              await editReply(renderProfileDeletionPrompt());
              break;

            case deleteProfilePromptCancel:
              await editReply(renderProfileView());
              break;

            case deleteProfilePromptConfirm:
              await UserSettingsService.delete(
                requestedUserSettings.discordUserId,
              );
              await editReply(renderProfileDeletionSuccess());
              break;
          }
        })
        .catch(async () => {
          // No interaction received, go back and remove buttons
          const defaultView = renderProfileView();
          if (defaultView.components) {
            defaultView.components = [];
            await editReply(defaultView);
          }
        });
    }

    await editReply(renderProfileView());
  },
});
