const mongoose = require("mongoose");

const CountSchema = mongoose.Schema({
    timestamp: { type: Date, require: true },
    count: { type: Number, require: true }
}, { _id : false });

const TrackSchema = mongoose.Schema({
    guild_id: { type: String, require: true },
    member_count_history: [{ type: CountSchema }],
    user_count_history: [{ type: CountSchema }],
    online_member_count_history: [{ type: CountSchema }],
    vc_connected_members_count_history: [{ type: CountSchema }],
    channel_count_history: [{ type: CountSchema }],
    role_count_history: [{ type: CountSchema }]
}, { _id : false });

module.exports = mongoose.model('tracks', TrackSchema);