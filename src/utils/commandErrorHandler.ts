import Eris, { TextChannel } from 'eris';

const commandErrorHandler = async (
  channel: Eris.AnyChannel,
  languagePack,
  error: any,
): Promise<void> => {
  const { errorDb, errorDiscordAPI, errorUnknown } = languagePack.common;
  const errorText = languagePack.common.error;
  try {
    switch (error.constructor.name) {
      case 'UserError':
        if (channel instanceof TextChannel)
          await channel.createMessage(`**${errorText}:** ${error.message}`);
        break;

      case 'MongooseError':
      case 'MongooseNativeError':
        if (channel instanceof TextChannel)
          await channel.createMessage(`**${errorText}:** ${errorDb}`);
        throw error;
        break;

      case 'DiscordRESTError':
      case 'DiscordHTTPError':
        if (channel instanceof TextChannel)
          await channel.createMessage(
            `**${errorText}:** ${errorDiscordAPI}: ${error.message} `,
          );
        break;

      default:
        if (channel instanceof TextChannel)
          await channel.createMessage(`**${errorText}:** ${errorUnknown}`);
        throw error;
        break;
    }
  } catch (error) {
    console.error(error);
  }
};

export default commandErrorHandler;
