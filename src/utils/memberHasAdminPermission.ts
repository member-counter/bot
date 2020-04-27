import getEnv from './getEnv';
import Eris from 'eris';
import GuildService from '../services/GuildService';

const { BOT_OWNERS } = getEnv();

export default async (member: Eris.Member): Promise<boolean> => {
  const guildSettings = await GuildService.init(member.guild.id);

  let hasAnyAllowedRole: boolean = false;
  for (const allowedRoleId of guildSettings.allowedRoles) {
    if (member.roles.includes(allowedRoleId)) {
      hasAnyAllowedRole = true;
      break;
    }
  }

  return (
    (member.permission.allow & 0x8) === 0x8 ||
    BOT_OWNERS.includes(member.id) ||
    hasAnyAllowedRole
  );
};
