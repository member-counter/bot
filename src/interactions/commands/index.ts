import { inlineCode } from "@discordjs/builders";
import {
	CommandInteraction,
	PermissionsBitField,
	IntentsBitField,
	ApplicationCommandOptionType
} from "discord.js";
import { i18n } from "../../services/i18n";
import type { Command } from "../../structures";
import { inviteCommand } from "./invite";
import { settingsCommand } from "./settings";

export const allCommands: Command[] = [inviteCommand, settingsCommand];

export const allCommandsNeededPermissions: PermissionsBitField =
	new PermissionsBitField(allCommands.map((c) => c.neededPermissions.bitfield));

export const allCommandsNeededIntents: IntentsBitField = new IntentsBitField(
	allCommands.map((c) => c.neededIntents.bitfield)
);

export default async function handleCommand(
	commandInteraction: CommandInteraction
): Promise<void> {
	const translate = await i18n(commandInteraction);

	for (const command of allCommands) {
		if (command.definition.name === commandInteraction.commandName) {
			// eslint-disable-next-line no-inner-declarations
			async function searchAndRunCommand(
				subcommandExecute: typeof command.execute,
				rawOptions: any[]
			) {
				const OptionTypes = ApplicationCommandOptionType;
				if (
					Array.isArray(rawOptions) &&
					rawOptions.some((rawOption) =>
						[OptionTypes.SubcommandGroup, OptionTypes.SubcommandGroup].includes(
							rawOption.type
						)
					)
				) {
					let found = false;
					for (const rawOption of rawOptions) {
						if (
							commandInteraction.options.getSubcommandGroup(false) ===
								rawOption.name ||
							commandInteraction.options.getSubcommand(false) === rawOption.name
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
								commandInteraction.options.getSubcommandGroup(false)
							)} -> ${inlineCode(
								commandInteraction.options.getSubcommand(false)
							)} is not being handled correctly`
						);
				} else if (typeof subcommandExecute === "function") {
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
