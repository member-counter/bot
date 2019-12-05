#!/usr/bin/env node
require("dotenv").config();
const mongoose = require("mongoose");
const Discord = require("discord.js");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { SERVE_API, DISCORD_TOKEN, PORT, NODE_ENV, DB_URI } = process.env;

//BOT
const manager = new Discord.ShardingManager("./bot.js", {
    token: DISCORD_TOKEN
});

manager.spawn().catch(console.error);
manager.on("launch", shard => {
    console.log(`[Main] [Shard Manager] Launched shard #${shard.id}`);
});

//API
if (JSON.parse(SERVE_API)) {
    const app = express();
    http.createServer(app).listen(PORT, () =>
        console.log("[Main] [API] HTTP server ready. Port: " + PORT)
    );
    
    app.use((req, res, next) => {
        req.DiscordShardManager = manager;
        next();
    });
    
    app.use(bodyParser.json());
    
    //just to avoid problems while I'm developing this
    if (NODE_ENV === "development") app.use(cors());
    
    //api v1
    app.use(`/v1`, require("./api/v1/index"));
}

//mongoose connection
mongoose
    .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
        .then(() => {
            console.log("[Main] [Mongoose] Connection ready");
        })
        .catch(e => {
            console.error("[Main] [Mongoose] " + e);
            process.exit(1);
        });
