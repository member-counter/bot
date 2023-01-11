import fetch from "node-fetch";
import getEnv from "../utils/getEnv";
import Job from "../typings/Job";

const {
	DISCORD_CLIENT_ID,
	DBL_TOKEN,
	DBGG_TOKEN,
	DBOATS_TOKEN,
	BOND_TOKEN,
	BFD_TOKEN,
	SEND_BOT_STATS
} = getEnv();

const postBotStatus: Job = {
	time: "0 */10 * * * *",
	runAtStartup: false,
	runInOnlyFirstThread: true,
	run: async ({ client }) => {
		if (SEND_BOT_STATS) {
			const stats = await client.getStats();
			const shardCount = stats.shards.length;
			const guildCount = stats.guilds;

			//https://discord.bots.gg
			fetch(`https://discord.bots.gg/api/v1/bots/${DISCORD_CLIENT_ID}/stats`, {
				method: "post",
				headers: {
					Authorization: DBGG_TOKEN,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ guildCount })
			})
				.then((response) =>
					console.log(
						`[STATS SENDER] [discord.bots.gg] Stats sent, response: ${response.status}`
					)
				)
				.catch(console.error);

			//https://top.gg/
			fetch(`https://top.gg/api/bots/${DISCORD_CLIENT_ID}/stats`, {
				method: "post",
				headers: {
					Authorization: DBL_TOKEN,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					server_count: guildCount,
					shard_count: shardCount
				})
			})
				.then((response) =>
					console.log(
						`[STATS SENDER] [top.gg] Stats sent, response: ${response.status}`
					)
				)
				.catch(console.error);

			//https://botsfordiscord.com
			fetch(`https://botsfordiscord.com/api/bot/${DISCORD_CLIENT_ID}`, {
				method: "post",
				headers: {
					Authorization: BFD_TOKEN,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ server_count: guildCount })
			})
				.then((response) =>
					console.log(
						`[STATS SENDER] [botsfordiscord.com] Stats sent, response: ${response.status}`
					)
				)
				.catch(console.error);
		}
	}
};

export default postBotStatus;
