import getEnv from '../utils/getEnv';
import MemberCounterCommand from '../typings/MemberCounterCommand';
import embedBase from '../utils/embedBase';

const {
  DONATION_URL,
  DISCORD_BOT_INVITE,
  DISCORD_OFFICIAL_SERVER_URL,
} = getEnv();

const info: MemberCounterCommand = {
  aliases: ['info', 'invite', 'github', 'support', 'bug'],
  denyDm: false,
  onlyAdmin: false,
  run: ({ message, languagePack }) => {
    const { channel } = message;
    const embed = embedBase(languagePack.commands.info.embedReply);
    embed.description = embed.description
      .replace('{DONATION_URL}', DONATION_URL)
      .replace('{BOT_SERVER_URL}', DISCORD_OFFICIAL_SERVER_URL)
      .replace('{BOT_INVITE_URL}', DISCORD_BOT_INVITE);

    channel.createMessage({ embed }).catch(console.error);
  },
};

const infoCommands = [info];

export default infoCommands;
