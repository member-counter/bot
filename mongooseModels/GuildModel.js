const mongoose = require('mongoose');

const CustomNumbers = mongoose.Schema({
    1: { type: String, default: '1' },
    2: { type: String, default: '2' },
    3: { type: String, default: '3' },
    4: { type: String, default: '4' },
    5: { type: String, default: '5' },
    6: { type: String, default: '6' },
    7: { type: String, default: '7' },
    8: { type: String, default: '8' },
    9: { type: String, default: '9' },
    0: { type: String, default: '0' }
}, { _id : false });

const GuildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guild_id: { type: String, require: true },
    lang: { type: String, default:"en_US" },
    channel_id: { type: String, default: '0' },
    topic: { type: String, default: 'Members: {COUNT}' },
    custom_numbers: { type: CustomNumbers, default: CustomNumbers }
});

module.exports = mongoose.model('guilds', GuildSchema);