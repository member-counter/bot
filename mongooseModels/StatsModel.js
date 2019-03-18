const mongoose = require('mongoose');

const StatsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, require: true },
    count: { type: Number, default: 1 }
});

module.exports = mongoose.model('stats', StatsSchema);