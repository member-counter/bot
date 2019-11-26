const mongoose = require("mongoose");

const TrackSchema = mongoose.Schema({
    guild_id: { type: String, require: true },
    type: { type: String, require: true },
    timestamp: { type: Date, require: true },
    count: { type: Number, require: true }
});

module.exports = mongoose.model('tracks', TrackSchema);