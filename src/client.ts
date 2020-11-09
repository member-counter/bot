import Eris from "eris";
import getEnv from './utils/getEnv';

import ready from './events/ready';
import channelCreate from './events/channelCreate';
import channelUpdate from './events/channelUpdate';
import channelDelete from './events/channelDelete';
import guildCreate from './events/guildCreate';
import guildMemberAdd from './events/guildMemberAdd';
import messageCreate from './events/messageCreate';
import messageReactionAdd from './events/messageReactionAdd';
import messageReactionRemove from './events/messageReactionRemove';

const { PREMIUM_BOT, DISCORD_CLIENT_TOKEN, DEBUG } = getEnv();

const startDiscordClient = (): Eris.Client => {
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

  const client = new Eris.Client(DISCORD_CLIENT_TOKEN, {
    getAllUsers: PREMIUM_BOT,
    guildCreateTimeout: 15000,
    intents,
    maxShards: 'auto',
    messageLimit: 0,
    defaultImageFormat: 'jpg',
    compress: true,
    restMode: true,
  });
  
  if (DEBUG) {
    client.on('debug', console.log);
  }
  client
    .on('ready', () => ready(client))
    .on('error', console.error)
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
  
  client.connect();
  
  return client;
}

export default startDiscordClient;