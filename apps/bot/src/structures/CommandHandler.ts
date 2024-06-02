import type {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import type { ChatInputCommandInteraction } from "discord.js";

export type CommandCtx = (
  command: ChatInputCommandInteraction,
  translate: Awaited<Promise<() => string>>, // TODO
) => void | Promise<void>;

type SlashCommandUnion =
  | SlashCommandBuilder
  | SlashCommandSubcommandsOnlyBuilder
  | SlashCommandOptionsOnlyBuilder
  | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

interface SubCommandsExecute {
  [key: string]: CommandCtx | SubCommandsExecute;
}

export class CommandHandler<N> {
  name: N;
  definition: SlashCommandUnion;
  execute: CommandCtx | SubCommandsExecute;

  constructor(options: CommandHandler<N>) {
    this.name = options.name;
    this.definition = options.definition;
    this.execute = options.execute;
  }
}
