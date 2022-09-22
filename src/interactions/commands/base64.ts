import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../../structures";

export const base64Command = new Command<"base64">({
	name: "base64",
	definition: new SlashCommandBuilder()
		.setName("base64")
		.setDescription("untranslated")
		.addSubcommand((command) =>
			command
				.setName("encode")
				.setDescription("Used to encode the input to base64")
				.addStringOption((option) =>
					option
						.setName("text")
						.setDescription("Provide the text you want to encode to base64")
						.setRequired(true)
				)
		)
		.addSubcommand((command) =>
			command
				.setName("decode")
				.setDescription("Used to decode base64 input")
				.addStringOption((option) =>
					option
						.setName("text")
						.setDescription("Provide the text you want to decode")
						.setRequired(true)
				)
		),
	execute: {
		encode: async (command) => {
			const input = command.options.get("text").value as string;
			command.reply({
				content: Buffer.from(input).toString("base64"),
				ephemeral: true
			});
		},
		decode: async (command) => {
			const input = command.options.get("text").value as string;
			command.reply({
				content: Buffer.from(input, "base64").toString(),
				ephemeral: true
			});
		}
	},
	// TODO: set the right intents and permissions
	neededIntents: ["Guilds"],
	neededPermissions: ["SendMessages", "ViewChannel"]
});
