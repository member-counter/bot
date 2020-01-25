#!/usr/bin/env node
require("dotenv").config();
const { DISCORD_TOKEN, DB_URI } = process.env;
const mongoose = require("mongoose");
const Eris = require("eris");

const eventHandler = require("./src/bot/eventHandler");
const GuildsCounts = require("./src/bot/utils/guildsCounts/GuildsCounts");

const client = new Eris(DISCORD_TOKEN, {
  getAllUsers: true,
  guildCreateTimeout: 15000,
  disableEvents: ['TYPING_START'],
  messageLimit: 0,
  defaultImageFormat: "jpg",
  compress: true,
  restMode: true,
});

client.connect();

client.guildsCounts = new GuildsCounts(client);
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