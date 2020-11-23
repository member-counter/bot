import * as Eris from 'eris';
import getEnv from './getEnv';

import ready from '../events/ready';
import channelCreate from '../events/channelCreate';
import channelUpdate from '../events/channelUpdate';
import channelDelete from '../events/channelDelete';
import guildCreate from '../events/guildCreate';
import guildMemberAdd from '../events/guildMemberAdd';
import messageCreate from '../events/messageCreate';
import messageReactionAdd from '../events/messageReactionAdd';
import messageReactionRemove from '../events/messageReactionRemove';

const { DEBUG } = getEnv();

export default (client: Eris.Client) => {
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
};
