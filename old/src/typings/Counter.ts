import Eris from "eris";
import { ErisClient } from "../bot";
import GuildService from "../services/GuildService";
import FormattingSettings from "./FormattingSettings";

interface executeArgs {
	client: ErisClient;

	/**
	 * @description Current guild
	 */
	guild: Eris.Guild;

	/**
	 * @description Current guild settings
	 */
	guildSettings: GuildService;

	/**
	 * @description Formatting settings for the counter
	 */
	formattingSettings: FormattingSettings;

	/**
	 * @description Resource, like a list of role IDs, a piece of text, an URI, etc
	 */
	unparsedArgs: string;

	/**
	 * @description The args but splitted depending on which separator has been used
	 */
	args: string[][];

	/**
	 * @description The alias that was used
	 */
	aliasUsed: string;
}

interface executeFunction {
	({}: executeArgs): Promise<
		number | string | { [key: string]: number | string }
	>;
}

interface Counter {
	/**
	 * @description The name of the counter or counters, case insensitive, don't include the curly braces
	 */
	aliases: string[];

	/**
	 * @description If false, "Only Premium" will be displayed (when PREMIUM_BOT or UNRESTRICTED_MODE is true), and execute won't be run
	 */
	isPremium: boolean;

	/**
	 * @description If false, "Counter Disabled" will be displayed, and execute won't be run
	 */
	isEnabled: boolean;

	/**
	 * @description Lifetime of the returned value(s) of 'execute' in milliseconds
	 */
	lifetime: number;

	/**
	 * @returns {number|string|object} When a number is returned, it will be processed depending on the guild settings, when a string is returned, it will be displayed directly, if it's a object, the keys (counter name) and it's values (string|number) will be added to the cache
	 */
	execute: executeFunction;
}

export default Counter;
