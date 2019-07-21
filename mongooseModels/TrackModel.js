const mongoose = require('mongoose');

const CountSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    timestamp: { type: Date, require: true },
    count: { type: Number, require: true }
}, { _id : false });

const TrackSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guild_id: { type: String, require: true },
    count_history: [{ type: CountSchema }]
});

module.exports = mongoose.model('tracks', TrackSchema);