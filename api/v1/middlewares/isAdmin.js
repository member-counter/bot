const Discord = require("discord.js");
const fetch = require("node-fetch");
const owners = process.env.BOT_OWNERS.split(/,\s?/);

module.exports = (req, res, next) => {
    if (owners.includes(req.user.id)) {
        next();
    } else {
        //TODO check if use is admin in the guild (req.param.id)
    }
};
