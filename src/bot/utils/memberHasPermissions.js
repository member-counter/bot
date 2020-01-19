const owners = process.env.BOT_OWNERS.split(/,\s?/);

/**
 * @param {Discord.GuildMember} member User object
 * @param {GuildModel} guildSettings Guild settings
 */
module.exports = (member, guildSettings) => {
    let hasAnyAllowedRole = false;

    guildSettings.allowedRoles.forEach(roleId => {
        if (member.roles.includes(roleId)) hasAnyAllowedRole = true;
    });
    
    return (member.has('administrator') || owners.includes(member.id) || hasAnyAllowedRole);
};