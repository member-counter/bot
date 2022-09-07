import {
	CommandInteraction,
	PermissionResolvable,
	Permissions,
	Intents
} from "discord.js";
import { i18n } from "../services/i18n";
import { Unwrap } from "../utils/Unwrap";

type CommandExecute = (
	command: CommandInteraction,
	translate: Unwrap<typeof i18n>
) => void | Promise<void>;

interface SubCommandsExecute {
	[key: string]: CommandExecute | SubCommandsExecute;
}

interface CommandOptions {
	definition: any;
	execute: CommandExecute | SubCommandsExecute;
	/**
	 * @description Add intents here that might be needed by your code, like intents for awaiting reactions
	 */
	neededIntents?: Intents;
	/**
	 * @description Add here the permissions needed, this will be used to create invite links with all the necessary permissions
	 */
	neededPermissions?: PermissionResolvable[];
}

export class Command {
	definition: any;
	execute: CommandExecute | SubCommandsExecute;
	neededIntents: Intents;
	neededPermissions: Permissions;

	constructor(options: CommandOptions) {
		this.definition = options.definition;
		this.execute = options.execute;
		this.neededIntents = new Intents(options.neededIntents);
		this.neededPermissions = new Permissions(options.neededPermissions);
	}
}
