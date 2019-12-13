const TrackModel = require("../../mongooseModels/TrackModel");
const fetchGuildSettings = require("./fetchGuildSettings");
const mongoose = require("mongoose");

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
        addTrackQueue.set(guild_id+target, setTimeout(() => {
            
            if (target === "memberswithrole_count_history") target += "-" + other.channelId;
            
            const track = new TrackModel({ 
                _id: new mongoose.Types.ObjectId(),
                guild_id,
                type: target,
                timestamp: new Date(),
                count
            });

            track.save().catch(console.error);

            addTrackQueue.delete(guild_id+target);
        }, TIME_BETWEEN_EVERY_ADD_TRACK));
    }

};

//I dedicate this.code to Alex, thank you for all ♥
