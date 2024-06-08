import type {
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import type { CommandInteraction } from "discord.js";

import type { initI18n } from "~/i18n";

export type CommandHandle = (
  command: CommandInteraction,
  i18n: Awaited<ReturnType<typeof initI18n>>,
) => void | Promise<void>;

type SlashCommandUnion =
  | SlashCommandBuilder
  | SlashCommandSubcommandsOnlyBuilder
  | SlashCommandOptionsOnlyBuilder
  | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

export class Command {
  slashDefinition?: SlashCommandUnion;
  contextDefinition?: ContextMenuCommandBuilder;
  handle: CommandHandle;

  constructor(options: Command) {
    this.slashDefinition = options.slashDefinition;
    this.contextDefinition = options.contextDefinition;
    this.handle = options.handle;
  }
}