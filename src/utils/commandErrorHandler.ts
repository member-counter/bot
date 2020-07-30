import Eris, { TextChannel } from 'eris';
import embedBase from './embedBase';

const commandErrorHandler = async (
  channel: Eris.AnyChannel,
  languagePack,
  error: any,
): Promise<void> => {
  const { errorDb, errorDiscordAPI, errorUnknown } = languagePack.common;
  const errorText = languagePack.common.error;

  const errorEmbed = embedBase({
    title: errorText,
    description: '',
    color: 16711680,
  });

  switch (error.constructor.name) {
    case 'UserError':
      errorEmbed.description = error.message;
      break;

    case 'MongooseError':
    case 'MongooseNativeError':
      errorEmbed.description = errorDb;
      console.error(error);
      break;

    case 'DiscordRESTError':
    case 'DiscordHTTPError':
      errorEmbed.description = `${errorDiscordAPI}: ${error.message}`;
      break;

    default:
      errorEmbed.description = errorUnknown;
      console.error(error);
      break;
  }

  
  if (channel instanceof TextChannel)
    channel.createMessage({ embed: errorEmbed }).catch(() => {});
};

export default commandErrorHandler;
