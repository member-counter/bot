#!/usr/bin/env node
require("dotenv").config();
const { SERVE_API, DISCORD_TOKEN, PORT, NODE_ENV, DB_URI } = process.env;

const mongoose = require("mongoose");
const ErisSharder = require('eris-sharder').Master;
const postBotStats = require("./src/bot/others/postBotStats");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cluster = require("cluster");

const botSharder = new ErisSharder(DISCORD_TOKEN, "/src/bot.js", {
  name: "Member Counter",
  stats: true,
  statsInterval: 1 * 1000,
  clientOptions: {
    getAllUsers: true,
    disableEvents: ['TYPING_START'],
    messageLimit: 0,
    defaultImageFormat: "jpg",
    compress: true
  }
});

botSharder.on("stats", postBotStats);

// API
if (cluster.isMaster && JSON.parse(SERVE_API)) {
    const app = express();
    http.createServer(app).listen(PORT, () =>
        console.log("[API] HTTP server ready. Port: " + PORT)
    );
    
    app.use((req, res, next) => {
        req.DiscordShardManager = manager;
        next();
    });
    
    app.use(bodyParser.json());
    
    // TODO
    // app.use(`/v1`, require("./api/v1/index"));
}

// mongoose connection
mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
          .then(() => {
              console.log("[Mongoose] Connection ready");
          })
          .catch(error => {
              console.error("[Mongoose] " + error);
          });
