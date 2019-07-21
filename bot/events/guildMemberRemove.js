const updateCounter = require('../utils/updateCounter');
const GuildModel = require('../../mongooseModels/GuildModel');

module.exports = (client) => {
    client.on('guildMemberRemove', (member) => {
        updateCounter(client, member.guild.id);
        GuildModel.findOneAndUpdate({
            guild_id: member.guild.id
        }, {
            $push: {
                count_history: {
                    timestamp: new Date(),
                    count: client.guilds.get(member.guild.id).memberCount
                }
            }
        }).exec();
    });
}