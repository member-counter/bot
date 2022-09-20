import {
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandsOnlyBuilder
} from "@discordjs/builders";
import {
	BitFieldResolvable,
	CommandInteraction,
	GatewayIntentsString,
	IntentsBitField,
	PermissionFlagsBits,
	PermissionsBitField
} from "discord.js";

import { i18nService } from "../services/i18n";
import { Unwrap } from "../utils";

type CommandExecute = (
	command: CommandInteraction,
	translate: Unwrap<typeof i18nService>
) => void | Promise<void>;
type SlashCommandUnion =
	| SlashCommandBuilder
	| SlashCommandSubcommandsOnlyBuilder
	| SlashCommandOptionsOnlyBuilder
	| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
interface SubCommandsExecute {
	[key: string]: CommandExecute | SubCommandsExecute;
}

interface CommandOptions {
	definition: SlashCommandUnion;

	execute: CommandExecute | SubCommandsExecute;
	/**
	 * @description Add intents here that might be needed by your code, like intents for awaiting reactions
	 */
	neededIntents?: BitFieldResolvable<GatewayIntentsString, number>[];
	/**
	 * @description Add here the permissions needed, this will be used to create invite links with all the necessary permissions
	 */
	neededPermissions?: BitFieldResolvable<
		keyof typeof PermissionFlagsBits,
		bigint
	>[];
}

export class Command {
	definition: SlashCommandUnion;
	execute: CommandExecute | SubCommandsExecute;
	neededIntents: IntentsBitField;
	neededPermissions: PermissionsBitField;

	constructor(options: CommandOptions) {
		this.definition = options.definition;
		this.execute = options.execute;
		this.neededIntents = new IntentsBitField(options.neededIntents);
		this.neededPermissions = new PermissionsBitField(options.neededPermissions);
	}
}
