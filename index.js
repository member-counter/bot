#!/usr/bin/env node
require("dotenv").config();
const { DISCORD_TOKEN, DB_URI } = process.env;
const PREMIUM_BOT = JSON.parse(process.env.PREMIUM_BOT);
const mongoose = require("mongoose");
const Eris = require("eris");

const eventHandler = require("./src/bot/eventHandler");

const client = new Eris(DISCORD_TOKEN, {
  getAllUsers: PREMIUM_BOT,
  guildCreateTimeout: 15000,
  disableEvents: {
    TYPING_START: true,
    PRESENCE_UPDATE: !PREMIUM_BOT
  },
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
