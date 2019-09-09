const router = require("express").Router();
const Discord = require("discord.js");
const fetch = require("node-fetch");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const GuildModel = require("../../../mongooseModels/GuildModel");
const TrackModel = require("../../../mongooseModels/TrackModel");

router.get("/guilds", auth, (req, res) => {
    fetch(`https://discordapp.com/api/v6/users/@me/guilds`, {
        headers: { Authorization: req.headers.authorization }
    })
        .then(response => response.json())
        .then(guilds => {
            guilds = guilds.filter(guild => (new Discord.Permissions(guild.permissions)).has("ADMINISTRATOR"));
            res.json(guilds);
        })
        .catch(error => {
            console.error(error);
            res.json({ code: 500, message: "DB error" });
        });
});

//I should use streams
router.get('/guilds/:id/chart', auth, isAdmin, (req, res)  => {
    TrackModel.findOneAndUpdate({ guild_id: req.params.id }, { }, { upsert: true })
        .then(result => {
            res.json({ code: 0, chart: result.count_history });
        })
        .catch(error => {
            console.error(error);
            res.json({ code:500, message:"DB error" });
        });
});

module.exports = router;