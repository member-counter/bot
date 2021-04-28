import os from "os";
import git from "git-rev-sync";

import * as packageJSON from "../../package.json";
import Command from "../typings/Command";
import embedBase from "../utils/embedBase";
import GuildCountCacheModel from "../models/GuildCountCache";

const parseUptime = (inputDate: number) => {
	// inputDate must be in seconds
	const uptime = new Date(1970, 0, 1);
	uptime.setSeconds(Math.floor(inputDate));
	return `${Math.floor(
		inputDate / 60 / 60 / 24
	)} Days\n${uptime.getHours()} Hours\n${uptime.getMinutes()} Minutes\n${uptime.getSeconds()} Seconds`;
};

let gitHash = "";

try {
	gitHash = ` [${git.short()}](${
		git.remoteUrl().replace(".git", "/") + "commit/" + git.long()
	})`;
} catch {}

const status: Command = {
	aliases: ["uptime", "status", "ping"],
	denyDm: false,
	run: async ({ message, client }) => {
		const { channel } = message;
		const { version } = packageJSON;

		const clientStats = await client.getStats();
		const stats = {
			version: `Bot version: ${version}` + gitHash,
			clientUptime: parseUptime(client.uptime / 1000),
			processUptime: parseUptime(process.uptime()),
			systemUptime: parseUptime(os.uptime()),
			shardClusters: clientStats.clusters.length.toString(),
			loadAvg: os
				.loadavg()
				.map((x) => x.toPrecision(2))
				.join(" - "),
			memoryUsage:
				Number(
					(clientStats.memoryUsage.heapUsed / 1024 / 1024).toPrecision(3)
				) + "MB",
			botLatency:
				(await (async () => {
					const time = process.hrtime()[1];
					await new Promise((r) => setTimeout(r, 0));
					const latency = (process.hrtime()[1] - time) / 1000000;
					return Number(latency.toPrecision(3)); // remove extra decimals
				})()) + "ms",
			gatewayLatency:
				client.shards.get(client.guildShardMap[message.guildID] || 0).latency +
				"ms",
			hostname: os.hostname(),
			currentShard: "#" + ((client.guildShardMap[message.guildID] || 0) + 1),
			totalShards: clientStats.shards.length.toString(),
			guilds: clientStats.guilds.toString(),
			userStats: clientStats.users + " / " + clientStats.estimatedTotalUsers
		};

		const embed = embedBase({
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
					value: stats.guilds,
					inline: true
				},
				{
					name: "**Users:**",
					value:
						(
							await GuildCountCacheModel.aggregate([
								{
									$group: {
										_id: null,
										total: {
											$sum: "$members"
										}
									}
								}
							])
						)[0]?.total ?? "Unknown",
					inline: true
				}
			]
		});

		const RESTLatencyCheck = Date.now();
		await channel.createMessage({ embed }).then(async (message) => {
			// Bot latency field
			embed.fields[6].value = `${Date.now() - RESTLatencyCheck}ms`;

			await message.edit({ embed });
		});
	}
};

const statusCommands = [status];

export default statusCommands;
