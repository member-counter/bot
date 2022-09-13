import { inlineCode } from "@discordjs/builders";
import {
	ApplicationCommandOptionType,
	CommandInteraction,
	CommandInteractionOption,
	CommandInteractionOptionResolver,
	IntentsBitField,
	PermissionsBitField
} from "discord.js";

import { i18nService } from "../../services/i18n";
import { inviteCommand } from "./invite";
import { settingsCommand } from "./settings";
import { setupCommand } from "./setup";
import type { Command } from "../../structures";
import logger from "../../logger";
export const allCommands: Command[] = [
	inviteCommand,
	settingsCommand,
	setupCommand
];

export const allCommandsNeededPermissions: PermissionsBitField =
	new PermissionsBitField(allCommands.map((c) => c.neededPermissions.bitfield));

export const allCommandsNeededIntents: IntentsBitField = new IntentsBitField(
	allCommands.map((c) => c.neededIntents.bitfield)
);

export default async function handleCommand(
	commandInteraction: CommandInteraction
): Promise<void> {
	const translate = await i18nService(commandInteraction);

	for (const command of allCommands) {
		if (command.definition.name === commandInteraction.commandName) {
			async function searchAndRunCommand(
				subcommandExecute: typeof command.execute,
				rawOptions: CommandInteractionOption[]
			) {
				const OptionTypes = ApplicationCommandOptionType;

				if (
					Array.isArray(rawOptions) &&
					rawOptions.some((rawOption) =>
						[OptionTypes.SubcommandGroup, OptionTypes.Subcommand].includes(
							rawOption.type
						)
					)
				) {
					let found = false;
					for (const rawOption of rawOptions) {
						if (
							(
								commandInteraction.options as CommandInteractionOptionResolver
							).getSubcommandGroup(false) === rawOption.name ||
							(
								commandInteraction.options as CommandInteractionOptionResolver
							).getSubcommand(false) === rawOption.name
						) {
							if (typeof subcommandExecute === "object") {
								found = true;
								await searchAndRunCommand(
									subcommandExecute[rawOption.name],
									rawOption.options
								);
							}
							break;
						}
					}
					if (!found)
						throw new Error(
							`Command ${inlineCode(
								commandInteraction.commandName
							)} -> ${inlineCode(
								(
									commandInteraction.options as CommandInteractionOptionResolver
								).getSubcommandGroup(false)
							)} -> ${inlineCode(
								(
									commandInteraction.options as CommandInteractionOptionResolver
								).getSubcommand(false)
							)} is not being handled correctly`
						);
				} else if (typeof subcommandExecute === "function") {
					logger.debug(
						`${commandInteraction.user.username}#${
							commandInteraction.user.discriminator
						} (${
							commandInteraction.user.id
						}) is executing command ${commandInteraction} on channel ${
							commandInteraction.channel ?? commandInteraction.channelId
						}`
					);
					await subcommandExecute(commandInteraction, translate);
					return;
				}
			}

			await searchAndRunCommand(
				command.execute,
				command.definition.toJSON().options
			);
			break;
		}
	}
}
