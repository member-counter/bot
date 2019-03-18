const mongoose = require('mongoose');

const GuildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guild_id: { type: String, require: true },
    lang: { type: String, require: true, default:"en_US" }
});

module.exports = mongoose.model('guilds', GuildSchema);