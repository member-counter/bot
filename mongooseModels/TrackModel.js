const mongoose = require("mongoose");

const CountSchema = mongoose.Schema({
    timestamp: { type: Date, require: true },
    count: { type: Number, require: true }
}, { _id : false });

const TrackSchema = mongoose.Schema({
    guild_id: { type: String, require: true },
    count_history: [{ type: CountSchema }]
}, { _id : false });

module.exports = mongoose.model('tracks', TrackSchema);