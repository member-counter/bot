const TrackModel = require("../../mongooseModels/TrackModel");
const mongoose = require("mongoose");

/**
 * @typedef {"member_count_history" | "online_member_count_history" | "vc_connected_members_count_history" | "channel_count_history" | "role_count_history" | "memberswithrole_count_history" | "banned_member_count_history"} Targets
 */

/**
 * @param {string} guild_id Guild ID
 * @param {Targets} target
 * @param {Number} count
 */
module.exports = async (guild_id, type, count, other) => {
    if (type === "memberswithrole_count_history") type += "-" + other.channelId;
    
    TrackModel.insertMany([{ 
        guild_id,
        type,
        timestamp: new Date(),
        count
    }]).catch(console.error);
};

//I dedicate this.code to Alex, thank you for all ♥
