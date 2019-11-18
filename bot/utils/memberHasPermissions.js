const Discord = require("discord.js");
const GuildModel = require("../../mongooseModels/GuildModel");
const owners = process.env.BOT_OWNERS.split(/,\s?/);

/**
 * @param {Discord.GuildMember} member User object
 * @param {GuildModel} guildSettings Guild settings
 */
module.exports = (member, guildSettings) => {
    let hasAnyAllowedRole = false;

    guildSettings.allowedRoles.forEach(roleId => {
        if (member.roles.has(roleId)) hasAnyAllowedRole = true;
    });
    
    return (member.hasPermission('ADMINISTRATOR') || owners.includes(member.id) || hasAnyAllowedRole);
}
