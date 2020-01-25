#!/usr/bin/env node
require("dotenv").config();
const { SERVE_API, DISCORD_TOKEN, PORT, DB_URI } = process.env;
const cluster = require("cluster");
const ClusterHub  = require('cluster-hub');
const mongoose = require("mongoose");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const ErisSharder = require('eris-sharder').Master;

const postBotStats = require("./src/bot/others/postBotStats");
const areAllShardsReady = require("./src/bot/others/areAllShardsReady");

// =======Master=======

// This is what actually creates the workers, and also lanch an Eris instance per worker with a bunch of shards in each one
const erisSharder = new ErisSharder(DISCORD_TOKEN, "/src/ErisWorker.js", {
  name: "Member Counter",
  stats: true,
  clientOptions: {
    getAllUsers: true,
    disableEvents: ['TYPING_START'],
    messageLimit: 0,
    defaultImageFormat: "jpg",
    compress: true,
    restMode: true,
  }
});

//Post bot stats in bot pages
erisSharder.on("stats", console.log);


// This is used to interact with the clusters and perform actions or fetch data quickly
const clusterHub = new ClusterHub();

// Used by mc!status command
clusterHub.on("erisSharderStats", (_data, _sender, callback) => {
  erisSharder.stats.stats.partialData = !areAllShardsReady(erisSharder.stats.stats);

  callback(null, erisSharder.stats.stats);
});


// =======Worker=======
if (cluster.isWorker) {
    // API
    if (JSON.parse(SERVE_API)) {
      const app = express();
      http.createServer(app).listen(PORT, () =>
          console.log("[API] HTTP server ready. Port: " + PORT)
      );
      
      app.use((req, _res, next) => {
          req.botSharder = botSharder;
          req.clusterHub = clusterHub;
          next();
      });
      
      app.use(bodyParser.json());
      
      // TODO
      // app.use(`/v1`, require("./api/v1/index"));
    }


    // Mongoose connection
    mongoose
      .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
              .then(() => {
                  console.log("[Mongoose] Connection ready");
              })
              .catch(error => {
                  console.error("[Mongoose] " + error);
              });
}