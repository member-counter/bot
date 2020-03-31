#!/usr/bin/env node
require("dotenv").config();
const { DISCORD_TOKEN, DB_URI } = process.env;
const PREMIUM_BOT = JSON.parse(process.env.PREMIUM_BOT);
const mongoose = require("mongoose");
const Eris = require("eris");

const eventHandler = require("./src/bot/eventHandler");

const intents = [
  'guilds',
  'guildMembers',
  'guildBans',
  'guildVoiceStates',
  'guildMessages',
  'directMessages'
]

if (PREMIUM_BOT) intents.push('guildPresences');

const client = new Eris(DISCORD_TOKEN, {
  getAllUsers: PREMIUM_BOT,
  guildCreateTimeout: 15000,
  intents,
  maxShards: "auto",
  messageLimit: 0,
  defaultImageFormat: "jpg",
  compress: true,
  restMode: true,
});

client.connect();

eventHandler(client);

// Mongoose connection
mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => {
    console.log("[Mongoose] Connection ready");
  })
  .catch(error => {
    console.error("[Mongoose] " + error);
  });
