#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const Discord = require('discord.js');
const https = require('https');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const path = require('path');

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true}).then(()=>{console.log("[Main] Mongoose ready")}).catch((e)=>{console.error("[Main] " + e); process.exit(1)});
mongoose.set('useFindAndModify', false);

const manager = new Discord.ShardingManager('./bot.js', { token: process.env.TOKEN });

manager.spawn();
manager.on('launch', shard => console.log(`[Main] [Shard Manager] Launched shard #${shard.id}`));

//API
//I'm not sure if this is the correct way to keep alaways 'available' a process but I use this on webscokets and it works fine
const app = express();

const options = {key: fs.readFileSync(process.env.PATH_PRIVATE_KEY, 'utf8'), cert: fs.readFileSync(process.env.PATH_PUBLIC_KEY, 'utf8')};

const httpsServer = https.createServer(options, app).listen(process.env.PORT, () => console.log('[Main] [API] HTTPS server ready'));

app.use((req, res, next) => {
    req.DiscordShardManager = manager;
    next();
})

app.use(bodyParser.json());

//gzip
app.use(compression());

//just to avoid problems while I'm developing this
if (process.env.NODE_ENV === "development") app.use(cors());

//routes
app.use(`/api`, require('./api/index'));

//static folder
app.use(express.static(path.join(process.env.STATIC_DIR)));