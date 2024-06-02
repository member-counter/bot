import { SlashCommandBuilder } from "@discordjs/builders";
import os from "os";

import * as packageJSON from "../../../package.json";
import { Command } from "../../structures";
import { BaseMessageEmbed } from "../../utils";

const parseUptime = (inputDate: number) => {
	// inputDate must be in seconds
	const uptime = new Date(1970, 0, 1);
	uptime.setSeconds(Math.floor(inputDate));
	return `${Math.floor(
		inputDate / 60 / 60 / 24
	)} Days\n${uptime.getHours()} Hours\n${uptime.getMinutes()} Minutes\n${uptime.getSeconds()} Seconds`;
};
export const statusCommand = new Command<"status">({
	name: "status",
	definition: new SlashCommandBuilder()
		.setName("status")
		.setDescription("untranslated"),
	execute: async (command) => {
		const { client } = command;
		const { version } = packageJSON;

		const stats = {
			version: `Bot version: [${version}](https://github.com/eduardozgz/member-counter-bot/releases/tag/v${version})`,
			clientUptime: parseUptime(client.uptime / 1000),
			processUptime: parseUptime(process.uptime()),
			systemUptime: parseUptime(os.uptime()),
			shardClusters: "TODO: figure out shard clusters",
			loadAvg: os
				.loadavg()
				.map((x) => x.toPrecision(2))
				.join(" - "),
			memoryUsage:
				Number((process.memoryUsage().heapUsed / 1024 / 1024).toPrecision(3)) +
				"MB",
			botLatency:
				(await (async () => {
					const [, time] = process.hrtime();
					await new Promise((r) => setTimeout(r, 0));
					const latency = (process.hrtime()[1] - time) / 1000000;
					return Number(latency.toPrecision(3)); // remove extra decimals
				})()) + "ms",
			// TODO: figure out gateway latency
			gatewayLatency: client.ws.ping + "ms",
			hostname: os.hostname(),
			// TODO: figure out current Shard
			currentShard: "#" + "TODO: figure out current shard",
			totalShards: "TODO: get total shards",
			guilds: client.guilds.cache.size
		};

		const embed = new BaseMessageEmbed({
			description: stats.version,
			fields: [
				{
					name: "**Discord client uptime:**",
					value: stats.clientUptime,
					inline: true
				},
				{
					name: "**Process uptime:**",
					value: stats.processUptime,
					inline: true
				},
				{
					name: "**System uptime:**",
					value: stats.systemUptime,
					inline: true
				},
				{
					name: "**Shard clusters**",
					value: stats.shardClusters,
					inline: true
				},
				{
					name: "**Load avg:**",
					value: stats.loadAvg,
					inline: true
				},
				{
					name: "**Memory usage:**",
					value: stats.memoryUsage,
					inline: true
				},
				{
					name: "**REST latency:**",
					value: "Wait...",
					inline: true
				},
				{
					name: "**BOT latency:**",
					value: stats.botLatency,
					inline: true
				},
				{
					name: "**Gateway latency:**",
					value: stats.gatewayLatency,
					inline: true
				},
				{
					name: "**Hostname:**",
					value: stats.hostname,
					inline: true
				},
				{
					name: "**Current shard:**",
					value: stats.currentShard,
					inline: true
				},
				{
					name: "**Shards:**",
					value: stats.totalShards,
					inline: true
				},
				{
					name: "**Guilds:**",
					value: client.guilds.cache.size.toString(),
					inline: true
				},
				{
					name: "**Cached users / In guilds:**",
					value: `${client.users.cache.size}/${client.guilds.cache.reduce(
						(prev, guild) => prev + guild.memberCount,
						0
					)}`,
					inline: true
				}
			]
		});

		const RESTLatencyCheck = Date.now();
		await command.reply({ embeds: [embed] }).then(async () => {
			embed.spliceFields(6, 1, {
				name: "**REST latency:**",
				value: `${Date.now() - RESTLatencyCheck}ms`,
				inline: true
			});

			await command.editReply({ embeds: [embed] });
		});
	},
	neededPermissions: [],
	neededIntents: []
});
