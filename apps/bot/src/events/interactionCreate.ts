import type { i18n } from "i18next";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  inlineCode,
  InteractionType,
} from "discord.js";
import { v4 as uuid } from "uuid";

import logger from "@mc/logger";

import { env } from "~/env";
import { DiscordBrandingColors as Colors } from "../Constants";
import { initI18n } from "../i18n";
import handleButton from "../interactions/buttons";
import handleChatInputCommand from "../interactions/chatInputCommands.ts";
import handleModalSubmit from "../interactions/modals";
import { EventHandler } from "../structures";
import { BaseEmbed } from "../utils/BaseMessageEmbed";
import { UserError } from "../utils/UserError";

export const interactionCreateEvent = new EventHandler({
  name: "interactionCreate",
  handler: async (interaction) => {
    try {
      switch (interaction.type) {
        case InteractionType.ApplicationCommand: {
          if (interaction.isChatInputCommand()) {
            await handleChatInputCommand(interaction);
          }
          break;
        }
        case InteractionType.MessageComponent: {
          if (interaction.isButton()) {
            await handleButton(interaction);
          }
          break;
        }
        case InteractionType.ModalSubmit: {
          await handleModalSubmit(interaction);
          break;
        }
      }
    } catch (error) {
      if (interaction.isCommand() || interaction.isMessageComponent()) {
        const embed = new BaseEmbed(interaction.client);
        const id = uuid();
        let i18n: i18n;
        let title: string, description: string, supportServerBtn: string;

        try {
          i18n = await initI18n(interaction);
          title = i18n.t("interaction.commandHandler.error.title");
          description = i18n.t("interaction.commandHandler.error.description");
          supportServerBtn = i18n.t(
            "interaction.commands.invite.joinSupportServer",
          );
        } catch (e) {
          logger.error(e);
          title = "ERROR!";
          description =
            "Something went wrong, please, try again later\n\nError ID: {{ERROR_ID}}";
          supportServerBtn = "Join support server";
        }

        if (error instanceof UserError) {
          embed.setDescription(error.message);
        } else {
          embed.setDescription(
            description.replaceAll("{{ERROR_ID}}", inlineCode(id)),
          );
        }

        if (error instanceof Error) {
          logger.error(`Interaction error ${id}`);
          logger.error(error);
        }

        embed.setColor(Colors.Red);
        embed.setTitle(title);

        const componentRow = new ActionRowBuilder<ButtonBuilder>();
        componentRow.addComponents(
          new ButtonBuilder({
            style: ButtonStyle.Link,
            url: env.NEXT_PUBLIC_SUPPORT_URL,
            label: supportServerBtn,
          }),
        );

        interaction
          .reply({
            embeds: [embed],
            components: [componentRow],
            ephemeral: true,
          })
          .catch((error) => {
            logger.error("Interaction error reply error:", error);
          });
      } else {
        logger.error(
          "Something went wrong while processing the interaction: ",
          error,
        );
      }
    }
  },
});
