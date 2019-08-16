#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const Discord = require('discord.js');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true}).then(()=>{console.log("[Main] Mongoose ready")}).catch((e)=>{console.error("[Main] " + e); process.exit(1)});
mongoose.set('useFindAndModify', false);

const manager = new Discord.ShardingManager('./bot.js', { token: process.env.DISCORD_TOKEN });

manager.spawn();
manager.on('launch', shard => console.log(`[Main] [Shard Manager] Launched shard #${shard.id}`));

//API
const app = express();
http.createServer(app).listen(process.env.PORT, () => console.log('[Main] [API] HTTP server ready'));

app.use((req, res, next) => {
    req.DiscordShardManager = manager;
    next();
})

app.use(bodyParser.json());

//just to avoid problems while I'm developing this
if (process.env.NODE_ENV === "development") app.use(cors());

//routes
app.use(`/api`, require('./api/index'));
