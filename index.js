#!/usr/bin/env node
require("dotenv").config();
const { DISCORD_TOKEN, DB_URI, SERVE_API, PORT } = process.env;
const mongoose = require("mongoose");
const Eris = require("eris");
const http = require("http");
const express = require("express");

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


if (JSON.parse(SERVE_API)) {
  const app = express();
  http.createServer(app).listen(PORT, () =>
      console.log("[API] HTTP server ready. Port: " + PORT)
  );
  
  app.use((req, _res, next) => {
    req.discordClient = client;
    next();
  })

  app.use(express.json());

  app.use(`/v1`, require("./src/api/v1/index"));
}
