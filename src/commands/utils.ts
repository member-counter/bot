import MemberCounterCommand from "../typings/MemberCounterCommand";
import { GuildChannel, VoiceChannel, User } from "eris";
import botHasPermsToEdit from "../utils/botHasPermsToEdit";
import UserError from "../utils/UserError";
import GuildService from "../services/GuildService";
import CountService from "../services/CountService";
import Bot from "../bot";

const lockChannel: MemberCounterCommand = {
	aliases: ["lockChannel", "lock"],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, languagePack }) => {
		const {
			success,
			errorInvalidChannel,
			errorNoPerms,
			errorNotFound
		} = languagePack.commands.lockChannel;
		const { channel, content } = message;
		if (channel instanceof GuildChannel) {
			const [command, channelId] = content.split(/\s+/);
			const { guild } = channel;
			const { client } = Bot;

			if (guild.channels.has(channelId)) {
				const channelToEdit = guild.channels.get(channelId);
				if (channelToEdit instanceof VoiceChannel) {
					if (botHasPermsToEdit(channelToEdit)) {
						await channelToEdit.editPermission(
							client.user.id,
							0x00100000 | 0x00000400,
							0,
							"member"
						);
						await channelToEdit.editPermission(guild.id, 0, 0x00100000, "role");
					} else {
						throw new UserError(
							errorNoPerms.replace(/\{CHANNEL\}/gi, channelId)
						);
					}
				} else {
					throw new UserError(errorInvalidChannel);
				}
			} else {
				throw new UserError(errorNotFound);
			}

			await channel.createMessage(success);
		}
	}
};

const editChannel: MemberCounterCommand = {
	aliases: ["editChannel", "edit"],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, languagePack }) => {
		const { channel, content } = message;

		if (channel instanceof GuildChannel) {
			const { guild } = channel;
			const { client } = Bot;
			const guildSettings = await GuildService.init(guild.id);
			let [command, channelId, ...newContent]: any = content.split(/ +/);
			newContent = newContent.join(" ");

			if (!newContent)
				throw new UserError(languagePack.commands.editChannel.errorNoContent);

			if (!guild.channels.has(channelId))
				throw new UserError(languagePack.commands.editChannel.errorNotFound);

			await guildSettings.setCounter(channelId, newContent);
			await channel.createMessage(languagePack.commands.editChannel.success);
		}
	}
};

const preview: MemberCounterCommand = {
	aliases: ["test", "preview"],
	denyDm: true,
	onlyAdmin: false,
	run: async ({ message, languagePack }) => {
		const { channel, content } = message;
		if (channel instanceof GuildChannel) {
			const { guild } = channel;
			const { client } = Bot;
			const guildSettings = await GuildService.init(guild.id);
			let [command, ...contentToTest]: any = content.split(/ +/);
			contentToTest = contentToTest.join(" ");

			if (!contentToTest)
				throw new UserError(languagePack.commands.editChannel.errorNoContent);

			const counterService = await CountService.init(guild);

			const { channelName, channelTopic } = languagePack.commands.preview;

			const previewMessage = `${channelName}:\n${await counterService.processContent(
				contentToTest,
				false
			)}\n\n${channelTopic}:\n${await counterService.processContent(
				contentToTest,
				true
			)}`;

			await channel.createMessage(previewMessage);
		}
	}
};

const base64: MemberCounterCommand = {
	aliases: ["base64"],
	denyDm: false,
	onlyAdmin: false,
	run: async ({ message, languagePack }) => {
		const { channel, content } = message;

		let action = "";
		let string = "";
		let parts = content.trimStart().split(" ");
		parts.shift(); // remove command (base64 or any alias)

		for (const part of parts) {
			// if action has been found set yet and part is a whitespace, then
			if (!action && !part) continue;
			// else, if there is no action, set the current part to the action
			else if (!action) action = part;
			// else, if there is no part (but the action has been found before), recover a whitespace lost in the split
			else if (!part) string += " ";
			// else, concatenate the part to the string that will be encoded or decoded
			else string += part;
		}

		// remove the space that should be used to separate the action from the string
		string.slice(0, 1);

		switch (action) {
			case "encode": {
				await channel.createMessage(Buffer.from(string).toString("base64"));
				break;
			}

			case "decode": {
				await channel.createMessage(Buffer.from(string, "base64").toString());
				break;
			}

			default: {
				await channel.createMessage(languagePack.commands.base64.invalidAction);
				break;
			}
		}
	}
};

const utilCommands = [lockChannel, editChannel, preview, base64];

export default utilCommands;
