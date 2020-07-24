import MemberCounterCommand from '../typings/MemberCounterCommand';
import embedBase from '../utils/embedBase';
import UserService from '../services/UserService';
import Eris from 'eris';
import UserError from '../utils/UserError';
import getEnv from '../utils/getEnv';

const { BOT_OWNERS } = getEnv();

const generateBadgeList = (badges: number): string => {
  const hasBadge = (badgeN: number): boolean => (badges & badgeN) === badgeN;

  const badgeList = [];

  if (hasBadge(0b1)) badgeList.push('❤️');
  if (hasBadge(0b10)) badgeList.push('💎');
  if (hasBadge(0b100)) badgeList.push('🛠');
  if (hasBadge(0b1000)) badgeList.push('🌎');
  if (hasBadge(0b10000)) badgeList.push('💻');
  if (hasBadge(0b100000)) badgeList.push('🧠');
  if (hasBadge(0b1000000)) badgeList.push('🐛');
  if (hasBadge(0b10000000)) badgeList.push('🐱');

  badgeList.map((item, i) => {
    if (i % 2 === 0) return item + ' ';
  });

  return '``` ' + badgeList.join(' ') + ' ```';
};

const user: MemberCounterCommand = {
  aliases: ['me', 'profile', 'user'],
  denyDm: false,
  onlyAdmin: false,
  run: async ({ message, languagePack }) => {
    const { author, channel, mentions, content } = message;
    const { client } = channel;
    const [_command, userRequested, actionRequested, ...actionParams] = content.split(/\s+/);

    let targetUser: Eris.User = mentions[0] || client.users.get(userRequested) || author;
    const userSettings = await UserService.init(targetUser.id);

    if (actionRequested && BOT_OWNERS.includes(author.id))  {
      switch (actionRequested) {
        case 'grantserverupgrade': {
          await userSettings.grantAvailableServerUpgrades(1);
          break;
        }
        case 'grantbadge': {
          await userSettings.grantBadge(parseInt(actionParams[0], 2));
          await message.addReaction('✅');
          break;
        }
        case 'revokebadge': {
          await userSettings.revokeBadge(parseInt(actionParams[0], 2));
          await message.addReaction('✅');
          break;
        }
        
        default: {
          await message.addReaction('❓');
          break;
        }
      }
    }   

    const { badges, availableServerUpgrades } = userSettings;

    const embed = embedBase({
      author: {
        icon_url: targetUser.dynamicAvatarURL(),
        name: `${targetUser.username}#${targetUser.discriminator}`,
      },
      fields: [],
    });

    if (badges > 0) {
      embed.fields.push({
        name: languagePack.commands.profile.badges,
        value: generateBadgeList(badges),
        inline: true,
      });
    }

    embed.fields.push({
      name: languagePack.commands.profile.serverUpgradesAvailable,
      value: availableServerUpgrades.toString(10),
      inline: true,
    });

    await channel.createMessage({ embed });
    
  },
};

const userCommands = [user];

export default userCommands;
