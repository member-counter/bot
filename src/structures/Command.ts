import {
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandsOnlyBuilder
} from "@discordjs/builders";
import {
	CommandInteraction,
	GatewayIntentsString,
	PermissionsString
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
	neededIntents?: GatewayIntentsString[];
	/**
	 * @description Add here the permissions needed, this will be used to create invite links with all the necessary permissions
	 */
	neededPermissions?: PermissionsString[];
}

export class Command {
	definition: SlashCommandUnion;
	execute: CommandExecute | SubCommandsExecute;
	neededIntents: GatewayIntentsString[];
	neededPermissions: PermissionsString[];

	constructor(options: CommandOptions) {
		this.definition = options.definition;
		this.execute = options.execute;
		this.neededIntents = options.neededIntents;
		this.neededPermissions = options.neededPermissions;
	}
}
