const mongoose = require('mongoose');

const CustomNumbers = mongoose.Schema({
    1: { type: String, default: '<a:1G:469275169190445056>' },
    2: { type: String, default: '<a:2G:469275085451034635>' },
    3: { type: String, default: '<a:3G:469275208684011550>' },
    4: { type: String, default: '<a:4G:469275195170095124>' },
    5: { type: String, default: '<a:5G:469282528088293377>' },
    6: { type: String, default: '<a:6G:469275153038049280>' },
    7: { type: String, default: '<a:7G:469275104933838858>' },
    8: { type: String, default: '<a:8G:469275116988137482>' },
    9: { type: String, default: '<a:9G:469275181135691777>' },
    0: { type: String, default: '<a:0G:469275067969306634>' }
}, { _id : false });

const GuildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guild_id: { type: String, require: true },
    lang: { type: String, default:"en_US" },
    enabled_channels: [{ type: String, default: [] }],
    topic: { type: String, default: 'Members: {COUNT}' }, //used on all channels
    unique_topics: { type: Map, of: String, default: new Map() }, //specific topic per channel
    custom_numbers: { type: CustomNumbers, default: CustomNumbers }
});

module.exports = mongoose.model('guilds', GuildSchema);