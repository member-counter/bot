#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const { ShardingManager } = require('discord.js');

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true}).then(()=>{console.log("[Main] Mongoose ready")}).catch((e)=>{console.error("[Main] " + e); process.exit(1)});
mongoose.set('useFindAndModify', false);

const manager = new ShardingManager('./bot.js', { token: process.env.TOKEN });

manager.spawn();
manager.on('launch', shard => console.log(`[Main] [Shard Manager] Launched shard #${shard.id}`));
manager.on('message', message => console.log(`[Main] [Shard Manager] ${message}`));