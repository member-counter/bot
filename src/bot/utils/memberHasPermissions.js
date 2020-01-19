const owners = process.env.BOT_OWNERS.split(/,\s?/);

/**
 * Check if a member has permission to run admin commands
 * @param {Member} member User object
 * @param {GuildModel} guildSettings Guild settings
 */
module.exports = (member, guildSettings) => {

    let hasAnyAllowedRole = false;

    guildSettings.allowedRoles.forEach(roleId => {
        if (member.roles.includes(roleId)) hasAnyAllowedRole = true;
    });

    
    //       ADMINISTRATOR                                OWNERS                        ALLOWED ROLE (mc!role allow)
    return (((member.permission.allow & 0x8 ) === 0x8) || owners.includes(member.id) || hasAnyAllowedRole);
};