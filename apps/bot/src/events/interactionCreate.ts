import { randomUUID } from "crypto";
import type { i18n } from "i18next";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  inlineCode,
  InteractionType,
} from "discord.js";

import logger from "@mc/logger";

import { env } from "~/env";
import { DiscordBrandingColors as Colors } from "../Constants";
import { initI18n } from "../i18n";
import handleCommand from "../interactions/commands";
import { EventHandler } from "../structures";
import { BaseEmbed } from "../utils/BaseMessageEmbed";
import { UserError } from "../utils/UserError";

export const interactionCreateEvent = new EventHandler({
  name: "interactionCreate",
  handler: async (interaction) => {
    try {
      switch (interaction.type) {
        case InteractionType.ApplicationCommand: {
          if (interaction.isCommand()) {
            await handleCommand(interaction);
          }
          break;
        }
      }
    } catch (error) {
      if (interaction.isRepliable()) {
        const embed = new BaseEmbed(interaction.client);
        const id = randomUUID();
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
          .editReply({
            embeds: [embed],
            components: [componentRow],
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
