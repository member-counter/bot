const TrackModel = require("../../mongooseModels/TrackModel");

/**
 * @typedef {"member_count_history" | "user_count_history" | "online_member_count_history" | "vc_connected_members_count_history" | "channel_count_history" | "role_count_history"} Targets
 */

/**
 * @param {string} guild_id Guild ID
 * @param {Targets} target
 * @param {Number} count
 */
module.exports = (guild_id, target, count) => {
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
        { upsert: true }
    )
        .exec()
        .catch(console.error);
};

//I dedicate this.code to Alex, thank you for all ♥
