import { EmbedOptions } from 'eris';
import getEnv from './getEnv';

const { PREMIUM_BOT } = getEnv();

const embedBase = (embedToAppend?: EmbedOptions): EmbedOptions => ({
  color: PREMIUM_BOT ? 16723200 : 14503424,
  footer: {
    icon_url:
      'https://cdn.discordapp.com/avatars/343884247263608832/98ce0df05fc35de2510c045cb469e4f7.png?size=64',
    text: 'by eduardozgz#5695',
  },
  ...embedToAppend,
});

export default embedBase;
