require("dotenv").config();
const ErisSharder = require('eris-sharder').Master;
const { DISCORD_TOKEN } = process.env;
const postBotStats = require("./src/bot/others/postBotStats");

const botSharder = new ErisSharder(DISCORD_TOKEN, "/src/bot.js", {
  name: "Member Counter",
  stats: true,
  clientOptions: {
    getAllUsers: true,
    disableEvents: ['TYPING_START'],
    messageLimit: 0,
    defaultImageFormat: "jpg",
    compress: true
  }
});


botSharder.on("stats", postBotStats);


// TOOD
global.botSharder = botSharder;


// API
//TODO