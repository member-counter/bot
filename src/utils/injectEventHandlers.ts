import * as Eris from 'eris';
import getEnv from './getEnv';

import ready from '../events/ready';
import channelDelete from '../events/channelDelete';
import channelUpdate from '../events/channelUpdate';
import guildCreate from '../events/guildCreate';
import guildMemberAdd from '../events/guildMemberAdd';
import messageCreate from '../events/messageCreate';
import messageUpdate from '../events/messageUpdate';

const { DEBUG } = getEnv();

export default (client: Eris.Client) => {
  if (DEBUG) {
    client.on('debug', console.log).on('rawWS', console.log);
  }
  client
    .on('ready', () => ready(client))
    .on('error', console.error)
    .on('warn', console.warn)
    .on('channelDelete', channelDelete)
    .on('channelUpdate', channelUpdate)
    .on('guildCreate', guildCreate)
    .on('guildMemberAdd', guildMemberAdd)
    .on('messageCreate', (message) => messageCreate(client, message))
    .on('messageUpdate', (message) => messageUpdate(client, message));
};
