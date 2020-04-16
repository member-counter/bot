import * as Eris from 'eris';

import channelDelete from './events/channelDelete';

import getEnv from './utils/getEnv';

const { DEBUG } = getEnv();

export default (client: Eris.Client) => {
  if (DEBUG) {
    client.on('debug', console.log);
    client.on('rawWS', console.log);
  }
  client.on('channelDelete', channelDelete);
};
