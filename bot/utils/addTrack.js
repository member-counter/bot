const TrackModel = require("../../mongooseModels/TrackModel");
const GuildModel = require("../../mongooseModels/GuildModel");

const TIME_BETWEEN_EVERY_ADD_TRACK = parseInt(process.env.TIME_BETWEEN_EVERY_ADD_TRACK) * 1000;
const addTrackQueue = new Map();
/**
 * @typedef {"member_count_history" | "online_member_count_history" | "vc_connected_members_count_history" | "channel_count_history" | "role_count_history" | "memberswithrole_count_history" | "banned_member_count_history"} Targets
 */

/**
 * @param {string} guild_id Guild ID
 * @param {Targets} target
 * @param {Number} count
 */
module.exports = async (guild_id, target, count, other) => {
    if (!addTrackQueue.has(guild_id+target)) {

        const guildSettings = await GuildModel.findOneAndUpdate({ guild_id }, { }, { upsert: true, projection: { premium_status: 1 } })

        let guildTimeBetweenEveryAddTrack = TIME_BETWEEN_EVERY_ADD_TRACK;
        if (guildSettings.premium_status === 1) guildTimeBetweenEveryAddTrack = 5 * 1000;
        if (guildSettings.premium_status === 2) guildTimeBetweenEveryAddTrack = 1 * 1000;   

        addTrackQueue.set(guild_id+target, setTimeout(() => {
    
            if (target === "memberswithrole_count_history") target += "." + other.channelId;
            TrackModel.findOneAndUpdate(
                {
                    guild_id
                },
                {
                    $push: {
                        [target]: {
                            timestamp: new Date(),
                            count
                        }
                    }
                },
                { upsert: true, projection: { _id: 1 } }
            )   
                .exec()
                .catch(console.error);

            addTrackQueue.delete(guild_id+target);
        }, guildTimeBetweenEveryAddTrack));
    }

};

//I dedicate this.code to Alex, thank you for all ♥
