const updateCounter = require('../utils/updateCounter');

module.exports = (client) => {
    client.on('guildMemberRemove', (member)=>{updateCounter(client, member.guild.id)});
}