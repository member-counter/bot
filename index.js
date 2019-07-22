#!/usr/bin/env node

require('dotenv').config();

//bot
const mongoose = require('mongoose');
const Discord = require('discord.js');
const client = new Discord.Client();
const eventHandler = require('./bot/utils/eventHandler.js');

const mongodbUrl = process.env.DB_URI;
const token = process.env.TOKEN;

mongoose.connect(mongodbUrl, {useNewUrlParser: true}).then(()=>{console.log("Mongoose ready")}).catch((e)=>{console.error(e); process.exit(1)});
mongoose.set('useFindAndModify', false);

client.login(token);
eventHandler(client);

//discordbots.org
const dbl = require("dblapi.js");

const dblClient = new dbl(process.env.DBL_TOKEN, {statsInterval: 1800000}, client);

dblClient.on('posted', () => {
    console.log('[discordbots.org] Server count posted!');
});
  
dblClient.on('error', e => {
    console.error(`[discordbots.org] ${e}`)
});