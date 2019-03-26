#!/usr/bin/env node

//bot
require('./bot/utils/logManager')();
const {log, error} = require('./bot/utils/customConsole.js');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const client = new Discord.Client();
const eventHandler = require('./bot/utils/eventHandler.js');

const mongodbUrl = process.env.db || require('./bot-config.json').db;
const token = process.env.token || require('./bot-config.json').token;

mongoose.connect(mongodbUrl, {useNewUrlParser: true}).then(()=>{log("Mongoose ready")}).catch((e)=>{error(e); process.exit(1)});
client.login(token);
eventHandler(client);

//discordbots.org
const dbl = require("dblapi.js");
const dblToken = process.env.dblToken || require('./bot-config.json').dblToken;

const dblClient = new dbl(dblToken, {statsInterval: 1800000}, client);

dblClient.on('posted', () => {
    log('[discordbots.org] Server count posted!');
});
  
dblClient.on('error', e => {
    error(`[discordbots.org] ${e}`)
});