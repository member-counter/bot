const mongoose = require("mongoose");
const Discord = require("discord.js");
const dbl = require("dblapi.js");
const eventHandler = require("./bot/utils/eventHandler.js");
const updateCounter = require("./bot/utils/updateCounter");

global.spawnedAt = new Date();

const client = new Discord.Client({
    disabledEvents: ["TYPING_START"],
    fetchAllMembers: true
});

client.login(process.env.DISCORD_TOKEN).catch(console.error);
client.updateCounter = updateCounter;
eventHandler(client);

mongoose
    .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`[Bot shard #${client.shard.id}] Mongoose ready`);
    })
    .catch(error => {
        console.error(`[Bot Shard #${client.shard.id}] ${error}`);
        process.exit(1);
    });

mongoose.set("useFindAndModify", false);
