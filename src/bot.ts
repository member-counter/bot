import Eris from "eris";
import getEnv from "./utils/getEnv";
import { GatewayClient as ErisClient } from "@arcanebot/redis-sharder";

import ready from "./events/ready";
import error from "./events/error";
import channelCreate from "./events/channelCreate";
import channelUpdate from "./events/channelUpdate";
import channelDelete from "./events/channelDelete";
import guildCreate from "./events/guildCreate";
import guildMemberAdd from "./events/guildMemberAdd";
import messageCreate from "./events/messageCreate";
import messageReactionAdd from "./events/messageReactionAdd";
import messageReactionRemove from "./events/messageReactionRemove";
import userUpdate from "./events/userUpdate";

const {
	PREMIUM_BOT,
	DISCORD_CLIENT_TOKEN,
	DEBUG,
	DISTRIBUTED,
	FIRST_SHARD,
	SHARD_AMOUNT,
	TOTAL_SHARDS,
	REDIS_LOCK_KEY,
	REDIS_PASSWORD,
	REDIS_HOST,
	REDIS_PORT,
	STATUS_WEBHOOK_ID,
	STATUS_WEBHOOK_TOKEN,
	DISCORD_FILTER_GUILDS
} = getEnv();

class Bot {
	private static _client = null;
	static init() {
		if (this._client) throw new Error("Client is already initialized");

		const Intents = Eris.Constants.Intents;
		const intents: number[] = [
			Intents.guildMembers,
			Intents.guilds,
			Intents.guildBans,
			Intents.guildMessages,
			Intents.directMessages,
			Intents.guildMessageReactions,
			Intents.directMessageReactions
		];

		if (PREMIUM_BOT)
			intents.push(Intents.guildPresences, Intents.guildVoiceStates);

		const erisOptions: Eris.ClientOptions = {
			getAllUsers: PREMIUM_BOT,
			guildCreateTimeout: 15000,
			intents: intents.reduce((acc, cur) => acc | cur, 0),
			maxShards: DISTRIBUTED ? TOTAL_SHARDS : 1,
			messageLimit: 0,
			filterGuilds: DISCORD_FILTER_GUILDS,
			defaultImageFormat: "jpg",
			compress: true,
			restMode: true
		};

		const client = new ErisClient(DISCORD_CLIENT_TOKEN, {
			erisOptions,
			getFirstShard: async () => (DISTRIBUTED ? FIRST_SHARD : 0),
			shardsPerCluster: DISTRIBUTED ? SHARD_AMOUNT : 1,
			lockKey: REDIS_LOCK_KEY,
			redisPassword: REDIS_PASSWORD,
			redisHost: REDIS_HOST,
			redisPort: REDIS_PORT,
			webhooks: {
				discord: {
					id: STATUS_WEBHOOK_ID,
					token: STATUS_WEBHOOK_TOKEN
				}
			}
		});
		this._client = client;

		this.setupListeners(client);

		client.queue();

		return client;
	}

	private static setupListeners(client: ErisClient) {
		if (DEBUG) {
			client.on("debug", console.debug);
		}

		client
			.on("ready", ready)
			.on("error", error)
			.on("warn", console.warn)
			.on("channelCreate", channelCreate)
			.on("channelUpdate", channelUpdate)
			.on("channelDelete", channelDelete)
			.on("guildCreate", guildCreate)
			.on("guildMemberAdd", guildMemberAdd)
			.on("messageCreate", messageCreate)
			.on("messageUpdate", messageCreate)
			.on("messageReactionAdd", messageReactionAdd)
			.on("messageReactionRemove", messageReactionRemove)
			.on("userUpdate", userUpdate);
	}

	static get client(): ErisClient {
		if (!this._client) throw new Error("You must call .init() first");
		return this._client;
	}
}

export default Bot;
export { Bot, ErisClient };
