const mongoose = require("mongoose");
const Discord = require("discord.js");
const eventHandler = require("./bot/utils/eventHandler.js");
const updateCounter = require("./bot/utils/updateCounter");
const { DISCORD_TOKEN, DB_URI } = process.env;
global.base64 = require("./bot/utils/base64");
global.spawnedAt = new Date();

const client = new Discord.Client({
    disabledEvents: ["TYPING_START"],
    fetchAllMembers: true
});

client.login(DISCORD_TOKEN).catch(console.error);
client.updateCounter = updateCounter;
eventHandler(client);

mongoose
    .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
        .then(() => {
            console.log(`[Bot shard #${client.shard.id}] [Mongoose] Connection ready`);
        })
        .catch(error => {
            console.error(`[Bot Shard #${client.shard.id}] [Mongoose] ${error}`);
            process.exit(1);
        });

mongoose.set("useFindAndModify", false);
