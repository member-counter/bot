#!/usr/bin/env node
import * as Eris from 'eris';
import mongoose from 'mongoose';
import getEnv from './utils/getEnv';

const { PREMIUM_BOT, DISCORD_CLIENT_TOKEN, DB_URI } = getEnv();

const intents: Eris.IntentStrings[] = [
  'guilds',
  'guildMembers',
  'guildBans',
  'guildMessages',
  'directMessages',
];

if (PREMIUM_BOT) intents.push('guildPresences', 'guildVoiceStates');

const client = new Eris.Client(DISCORD_CLIENT_TOKEN, {
  getAllUsers: PREMIUM_BOT,
  guildCreateTimeout: 15000,
  intents,
  maxShards: 'auto',
  messageLimit: 0,
  defaultImageFormat: 'jpg',
  compress: true,
  restMode: true,
});

client.connect();

// Mongoose connection
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('[Mongoose] Connection ready');
  })
  .catch((error) => {
    console.error('[Mongoose] ' + error);
  });
