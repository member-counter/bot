const mongoose = require('mongoose');
const Discord = require('discord.js');
const dbl = require("dblapi.js");
const eventHandler = require('./bot/utils/eventHandler.js');

const client = new Discord.Client();

client.login(process.env.TOKEN);
eventHandler(client);

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true}).then(()=>{console.log(`[Bot shard #${client.shard.id}] Mongoose ready`)}).catch((e)=>{console.error(`[Bot Shard #${client.shard.id}] ${e}`); process.exit(1)});
mongoose.set('useFindAndModify', false);

//DiscordBots.org
const dblClient = new dbl(process.env.DBL_TOKEN);

dblClient.on('ready', () => {
    setInterval(() => {
        dbl.postStats(client.guilds.size, client.shards.Id, client.shards.total);
    }, 5*60*1000);
});

dblClient.on('posted', () => {
    console.log(`[Bot shard #${client.shard.id}] [discordbots.org client] Server count posted!`);
});
  
dblClient.on('error', e => {
    console.error(`[Bot shard #${client.shard.id}] [discordbots.org client] ${e}`)
});