import type { SlashCommandBuilder } from "@discordjs/builders";
import type { ChatInputCommandInteraction } from "discord.js";

import type { initI18n } from "~/i18n";

export type CommandHandle = (
  command: ChatInputCommandInteraction,
  i18n: Awaited<ReturnType<typeof initI18n>>,
) => void | Promise<void>;

export class Command {
  definition: SlashCommandBuilder;
  handle: CommandHandle;

  constructor(options: Command) {
    this.definition = options.definition;
    this.handle = options.handle;
  }
}
