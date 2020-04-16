import * as Eris from 'eris';
import getEnv from './utils/getEnv';

import ready from './events/ready';
import channelDelete from './events/channelDelete';
import channelUpdate from './events/channelUpdate';
import guildCreate from './events/guildCreate';

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
    .on('guildCreate', guildCreate);
};
