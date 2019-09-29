const TrackModel = require("../../mongooseModels/TrackModel");

module.exports = member => {
    TrackModel.findOneAndUpdate(
        {
            guild_id: member.guild.id
        },
        {
            $push: {
                count_history: {
                    timestamp: new Date(),
                    count: client.guilds.get(member.guild.id).memberCount
                }
            }
        },
        { upsert: true }
    )
        .exec()
        .catch(console.error);
};

//I dedicate this code refactoring to Alex, thank you for all ♥