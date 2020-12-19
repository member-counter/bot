import { EmbedOptions } from 'eris';
import Bot from '../bot';
import ColorThief from 'colorthief';

let dominantColor = null;

const embedBase = (embedToAppend?: EmbedOptions): EmbedOptions => {
  if (!dominantColor) {
    ColorThief.getColor(Bot.client.user.dynamicAvatarURL("png", 1024))
      .then((colors: [number, number, number]) => {
        dominantColor = colors[0] << 16 | colors[1] << 8 | colors[2];
      });
  }

  return {
    color: dominantColor,
    footer: {
      icon_url:
        'https://cdn.discordapp.com/avatars/343884247263608832/98ce0df05fc35de2510c045cb469e4f7.png?size=64',
      text: 'by eduardozgz#5695',
    },
    ...embedToAppend,
  }
};

export default embedBase;
