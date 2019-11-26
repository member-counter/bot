const router = require("express").Router();
const Discord = require("discord.js");
const fetch = require("node-fetch");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const TrackModel = require("../../../mongooseModels/TrackModel");
const GuildModel = require("../../../mongooseModels/GuildModel");
const UserModel = require("../../../mongooseModels/UserModel");

//TODO get available guilds (check if the user has admin perms and if the bot is in the guild)
router.get("/guilds", auth, (req, res) => {
    req.DiscordShardManager.broadcastEval(`(() => {
        //TODO this.guilds
    })()`);
});

//TODO patch guild settings
router.patch("/guilds/:guildId/settings", auth, isAdmin, (req, res) => {

});

//TODO patch upgrade server tier
router.patch("/guilds/:guildId/upgrade-server", auth, isAdmin, (req, res) => {

});

//TODO return available counts
router.get("/guilds/:guildId/count-history", auth, isAdmin, (req, res) => {

});

//TODO use json streams
router.get("/guilds/:guildId/count-history/:type", auth, isAdmin, (req, res) => {

});

module.exports = router;