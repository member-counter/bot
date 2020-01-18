require("dotenv").config();
const ErisSharder = require('eris-sharder').Master;
const { DISCORD_TOKEN } = process.env;

const botSharder = new ErisSharder(DISCORD_TOKEN, "/src/bot.js", {
  name: "Member Counter",
  clientOptions: {
    getAllUsers: true,
    disableEvents: ['TYPING_START'],
    messageLimit: 0,
    defaultImageFormat: "jpg",
    compress: true
  }
});





process.botSharder = botSharder;
global.botSharder = botSharder;


// API
//TODO