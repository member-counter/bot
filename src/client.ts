import Eris from "eris";
import getEnv from './utils/getEnv';
import { GatewayClient as RedisSharderClient } from '@arcanebot/redis-sharder';

import ready from './events/ready';
import error from './events/error';
import channelCreate from './events/channelCreate';
import channelUpdate from './events/channelUpdate';
import channelDelete from './events/channelDelete';
import guildCreate from './events/guildCreate';
import guildMemberAdd from './events/guildMemberAdd';
import messageCreate from './events/messageCreate';
import messageReactionAdd from './events/messageReactionAdd';
import messageReactionRemove from './events/messageReactionRemove';

const {
  PREMIUM_BOT,
  DISCORD_CLIENT_TOKEN,
  DEBUG, DISTRIBUTED,
  FIRST_SHARD,
  SHARD_AMOUNT,
  TOTAL_SHARDS,
  REDIS_LOCK_KEY,
  REDIS_PASSWORD,
  REDIS_HOST,
  REDIS_PORT,
} = getEnv();

type ErisClient = Eris.Client & Partial<RedisSharderClient>;

class Bot {
  private static _client = null;
  static init() {
    if (this._client) throw new Error("Client is already initialized");

    const intents: Eris.IntentStrings[] = [
      'guildMembers',
      'guilds',
      'guildBans',
      'guildMessages',
      'directMessages',
      'guildMessageReactions',
      'directMessageReactions',
    ];

    if (PREMIUM_BOT) intents.push('guildPresences', 'guildVoiceStates');
    
    const erisOptions: Eris.ClientOptions = {
      getAllUsers: PREMIUM_BOT,
      guildCreateTimeout: 15000,
      intents,
      maxShards: DISTRIBUTED ? TOTAL_SHARDS : 1,
      messageLimit: 0,
      defaultImageFormat: 'jpg',
      compress: true,
      restMode: true,
    }
  
    const client = new RedisSharderClient(DISCORD_CLIENT_TOKEN, {
      erisOptions,
      getFirstShard: async () => DISTRIBUTED ? FIRST_SHARD : 0,
      shardsPerCluster: DISTRIBUTED ? SHARD_AMOUNT : 1,
      lockKey: REDIS_LOCK_KEY,
      redisPassword: REDIS_PASSWORD,
      redisHost: REDIS_HOST,
      redisPort: REDIS_PORT,
    });
    this._client = client;

    this.setupEventListeners(client);

    client.queue();

    return client;
  }

  private static setupEventListeners(client: Eris.Client) {
    if (DEBUG) {
      client.on('debug', console.info);
    }

    client
      .on('ready', ready)
      .on('error', error)
      .on('warn', console.warn)
      .on('channelCreate', channelCreate)
      .on('channelUpdate', channelUpdate)
      .on('channelDelete', channelDelete)
      .on('guildCreate', guildCreate)
      .on('guildMemberAdd', guildMemberAdd)
      .on('messageCreate', messageCreate)
      .on('messageUpdate', messageCreate)
      .on('messageReactionAdd', messageReactionAdd)
      .on('messageReactionRemove', messageReactionRemove);
  }

  static get client(): ErisClient {
    if (!this._client) throw new Error("You must call .init() first");
    return this._client;
  }
}

export default Bot;
export { Bot, ErisClient }
