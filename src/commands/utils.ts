import Command from "../typings/Command";
import { GuildChannel, VoiceChannel } from "eris";
import botHasPermsToEdit from "../utils/botHasPermsToEdit";
import UserError from "../utils/UserError";
import CountService from "../services/CountService";
import getEnv from "../utils/getEnv";
import setStatus from "../others/setStatus";
import Eris from "eris";
import ClientStatsService from "../services/ClientStatsService";
import { CommandUsage } from "../models/ClientStats";
import commands from "./all";
import embedBase from "../utils/embedBase";
import Paginator from "../utils/paginator";
const { BOT_OWNERS } = getEnv();

const lockChannel: Command = {
	aliases: ["lockChannel", "lock"],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, languagePack, client }) => {
		const {
			success,
			errorInvalidChannel,
			errorNoPerms,
			errorNotFound
		} = languagePack.commands.lockChannel;
		const { channel, content } = message;
		const [command, channelId] = content.split(/\s+/);
		const { guild } = channel;

		if (guild.channels.has(channelId)) {
			const channelToEdit = guild.channels.get(channelId);
			if (channelToEdit instanceof VoiceChannel) {
				if (botHasPermsToEdit(channelToEdit)) {
					await channelToEdit.editPermission(
						client.user.id,
						Eris.Constants.Permissions.voiceConnect |
							Eris.Constants.Permissions.viewChannel,
						0,
						// TODO use constants when abalabahaha/eris#1271 is merged
						1
					);
					await channelToEdit.editPermission(
						guild.id,
						0,
						Eris.Constants.Permissions.voiceConnect,
						// TODO use constants when abalabahaha/eris#1271 is merged
						0
					);
				} else {
					throw new UserError(errorNoPerms.replace(/\{CHANNEL\}/gi, channelId));
				}
			} else {
				throw new UserError(errorInvalidChannel);
			}
		} else {
			throw new UserError(errorNotFound);
		}

		await channel.createMessage(success);
	}
};

const editChannel: Command = {
	aliases: ["editChannel", "edit"],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, languagePack, guildService }) => {
		const { channel, content } = message;

		if (channel instanceof GuildChannel) {
			const { guild } = channel;
			let [command, channelId, ...newContent]: any = content.split(/ +/);
			newContent = newContent.join(" ");

			if (!newContent)
				throw new UserError(languagePack.commands.editChannel.errorNoContent);

			if (!guild.channels.has(channelId))
				throw new UserError(languagePack.commands.editChannel.errorNotFound);

			await guildService.setCounter(channelId, newContent);
			await channel.createMessage(languagePack.commands.editChannel.success);
		}
	}
};

const preview: Command = {
	aliases: ["test", "preview"],
	denyDm: true,
	onlyAdmin: false,
	run: async ({ message, languagePack, guildService }) => {
		const { channel, content } = message;
		if (channel instanceof GuildChannel) {
			const { guild } = channel;
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

const base64: Command = {
	aliases: ["base64"],
	denyDm: false,
	run: async ({ message, languagePack }) => {
		const { channel, content } = message;

		let action = "";
		let string = "";
		let parts = content.trimStart().split(" ");
		parts.shift(); // remove command ("base64" or any alias)

		for (const part of parts) {
			// if action has been not found yet AND part is a whitespace
			if (!action && !part) continue;
			// else, if there is no action, set the current part to the action
			else if (!action) action = part;
			// else, if there is no part (but the action has been found before), recover a whitespace lost in the split
			else if (!part) string += " ";
			// else, concatenate the part to the string that will be encoded or decoded
			else string += part;
		}

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

const setStatusCmd: Command = {
	aliases: ["setStatus"],
	denyDm: false,
	run: async ({ client, message, languagePack }) => {
		if (!BOT_OWNERS.includes(message.author.id)) return;
		let [, ...content] = message.content.split(" ");
		await message.channel.sendTyping();
		const { text, type, status } = setStatus(client, content.join(" "));
		await message.channel.createMessage(`Now _${type}_ **${text}**`);
	}
};

const commandStats: Command = {
	aliases: ["commandStats"],
	denyDm: false,
	run: async ({ client, message, languagePack }) => {
		const clientStats = await ClientStatsService.init(client.user.id);
		const commandStats: [string, CommandUsage][] = Array.from(
			clientStats.commandUsageStats.entries()
		).map(([key, entry]) => [JSON.parse(key), entry]);
		const allTotalHourlyUsage = commandStats
			.map(([, value]) => value.hourlyUsage)
			.reduce((a, b) => a + b);
		const allTotalDailyUsage = commandStats
			.map(([, value]) => value.dailyUsage)
			.reduce((a, b) => a + b);
		const allTotalWeeklyUsage = commandStats
			.map(([, value]) => value.weeklyUsage)
			.reduce((a, b) => a + b);
		const allTotalMonthlyUsage = commandStats
			.map(([, value]) => value.monthlyUsage)
			.reduce((a, b) => a + b);
		const allTotalUsage = commandStats
			.map(([, value]) => value.totalUsage)
			.reduce((a, b) => a + b);
		const description = languagePack.commands.commandStats.stats.usageText
			.replace(/{totalHourlyUsage}/, String(allTotalHourlyUsage))
			.replace(/{totalDailyUsage}/, String(allTotalDailyUsage))
			.replace(/{totalWeeklyUsage}/, String(allTotalWeeklyUsage))
			.replace(/{totalMonthlyUsage}/, String(allTotalMonthlyUsage))
			.replace(/{totalUsage}/, String(allTotalUsage));
		function chunkArray(array: Array<any>, arraySize: number): Array<any> {
			let index: number;
			const arrayLength = array.length;
			const tempArray = [];
			let splitArrays: Array<any>;

			for (index = 0; index < arrayLength; index += arraySize) {
				splitArrays = array.slice(index, index + arraySize);
				tempArray.push(splitArrays);
			}

			return tempArray;
		}
		const fields = [];
		commands.forEach((command) => {
			const {
				hourlyUsage,
				dailyUsage,
				weeklyUsage,
				monthlyUsage,
				totalUsage
			} = clientStats.commandUsageStats.get(JSON.stringify(command.aliases));
			const hourlyUsagePercent =
				((hourlyUsage / allTotalHourlyUsage) * 100).toFixed(1) === "NaN"
					? "0.0"
					: ((hourlyUsage / allTotalHourlyUsage) * 100).toFixed(1) + "%";
			const dailyUsagePercent =
				((dailyUsage / allTotalDailyUsage) * 100).toFixed(1) === "NaN"
					? "0.0"
					: ((dailyUsage / allTotalDailyUsage) * 100).toFixed(1) + "%";
			const weeklyUsagePercent =
				((weeklyUsage / allTotalWeeklyUsage) * 100).toFixed(1) === "NaN"
					? "0.0"
					: ((weeklyUsage / allTotalWeeklyUsage) * 100).toFixed(1) + "%";
			const monthlyUsagePercent =
				((monthlyUsage / allTotalMonthlyUsage) * 100).toFixed(1) === "NaN"
					? "0.0"
					: ((monthlyUsage / allTotalMonthlyUsage) * 100).toFixed(1) + "%";
			const totalUsagePercent =
				((totalUsage / allTotalUsage) * 100).toFixed(1) === "NaN"
					? "0.0"
					: ((totalUsage / allTotalUsage) * 100).toFixed(1) + "%";
			let field = Object.assign(
				{},
				languagePack.commands.commandStats.stats.commandUsageField
			);
			field = Object.assign(field, {
				name: field.name.replace(/{commandName}/, command.aliases[0])
			});
			field = Object.assign(field, {
				value: field.value
					.replace(/{commandHourlyPercentageOfTotal}/, hourlyUsagePercent)
					.replace(/{commandDailyPercentageOfTotal}/, dailyUsagePercent)
					.replace(/{commandWeeklyPercentageOfTotal}/, weeklyUsagePercent)
					.replace(/{commandMonthlyPercentageOfTotal}/, monthlyUsagePercent)
					.replace(/{commandTotalPercentageOfTotal}/, totalUsagePercent)
					.replace(/{commandHourlyUsage}/, String(hourlyUsage))
					.replace(/{commandDailyUsage}/, String(dailyUsage))
					.replace(/{commandWeeklyUsage}/, String(weeklyUsage))
					.replace(/{commandMonthlyUsage}/, String(monthlyUsage))
					.replace(/{commandUsageTotal}/, String(totalUsage))
			});
			fields.push(field);
		});
		const fieldsChunks = chunkArray(fields, 6);
		const embeds = fieldsChunks.map((fields) => {
			return embedBase({ description, fields, timestamp: new Date() });
		});
		new Paginator(
			message.channel,
			message.author.id,
			embeds,
			languagePack
		).displayPage(0);
	}
};

const utilCommands = [
	lockChannel,
	editChannel,
	preview,
	base64,
	setStatusCmd,
	commandStats
];

export default utilCommands;
