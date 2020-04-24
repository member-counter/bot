import Eris, { TextChannel } from 'eris';
import UserError from './UserError';
import {
  Mongoose,
  Error as MongooseError,
  NativeError as MongooseNativeError,
} from 'mongoose';

// TODO
const commandErrorHandler = async (
  channel: Eris.AnyChannel,
  languagePack,
  error: any,
): Promise<void> => {
  const { errorDb, errorDiscordAPI, errorUnknown } = languagePack.common;
  const errorText = languagePack.common.error;
  try {
    switch (error.constructor) {
      case UserError:
        if (channel instanceof TextChannel)
          await channel.createMessage(`**${errorText}:** ${error.message}`);
        break;

      case MongooseError:
      case MongooseNativeError:
        if (channel instanceof TextChannel)
          await channel.createMessage(`**${errorText}:** ${errorDb}`);

      default:
        if (channel instanceof TextChannel)
          await channel.createMessage(`**${errorText}:** ${errorUnknown}`);
        // AGGHHHH JUST THROW IT AGAIN! (╯°□°）╯︵ ┻━┻
        throw error;
        break;
    }
  } catch (error) {
    console.error(error);
  }
};

export default commandErrorHandler;
