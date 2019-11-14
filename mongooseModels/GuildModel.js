const mongoose = require('mongoose');
const { DISCORD_PREFIX } = process.env;

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
    guild_id: { type: String, require: true },
    premium_status: { type: Number, default: 0 }, //0 === no, 1 === low tier, 2 === high tier
    prefix: { type: String, default: DISCORD_PREFIX },
    lang: { type: String, default: "en_US" },
    enabled_channels: [{ type: String, default: [] }],
    topic: { type: String, default: "Members: {COUNT}" }, //used in all channels if the channel does not appear in this.unique_topics
    unique_topics: { type: Map, of: String, default: new Map() }, //specific topic by channel
    channelNameCounter: { type: Map, of: String, default: new Map() },
    channelNameCounter_types: { type: Map, of: String, default: new Map() },
    custom_numbers: { type: CustomNumbers, default: CustomNumbers }
}, { _id : false });

module.exports = mongoose.model('guilds', GuildSchema);