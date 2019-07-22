const updateCounter = require('../utils/updateCounter');
const TrackModel = require('../../mongooseModels/TrackModel');

module.exports = (client) => {
    client.on('guildMemberAdd', (member) => {
        updateCounter(client, member.guild.id);
        TrackModel.findOneAndUpdate({
            guild_id: member.guild.id
        }, {
            $push: {
                count_history: {
                    timestamp: new Date(),
                    count: client.guilds.get(member.guild.id).memberCount
                }
            }
        }, {upsert: true}).exec().catch(console.error);
    });
}