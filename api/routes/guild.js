const router = require('express').Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const GuildModel = require('../../mongooseModels/GuildModel');
const TrackModel = require('../../mongooseModels/TrackModel');
const Discord = require('discord.js');
const fetch = require('node-fetch');

router.get('/guilds', auth, (req, res)  => {
    fetch(`https://discordapp.com/api/v6/users/@me/guilds`, { headers: { 'Authorization' : req.headers.authorization } })
    .then(r => r.json())
    .then(r => {
        r = r.filter(guild => (new Discord.Permissions(guild.permissions)).has('ADMINISTRATOR'));
        res.json(r);
    })
    .catch(() => {
        res.json({code:500, message:"DB error"})
    });
});

router.get('/guilds/:id', auth, isAdmin, (req, res)  => {
    GuildModel.findOneAndUpdate({ guild_id: req.params.id }, {}, {upsert: true, new: true, projection: { _id: 0, __v: 0 }})
    .then(async guild_settings => {
        let guild_channels = (await req.DiscordShardManager.broadcastEval(`(this.guilds.get('${req.params.id}')) ? this.guilds.get('${req.params.id}').channels.keyArray() : []`)).flat();
        res.json({guild_channels, guild_settings})
    })
    .catch(e => {
        console.log(e)
        res.json({code:500, message:"DB error"})
    })
});

router.patch('/guilds/:id', auth, isAdmin, (req, res)  => {
    delete req.body.__v;
    delete req.body._id;
    GuildModel.findOneAndUpdate({ guild_id: req.params.id }, { ...req.body }, {upsert: true})
    .then((result) => {
        res.json({code: 0, message: "Updated sucessfully"});
        req.DiscordShardManager.broadcastEval(`this.updateCounter(this, "${req.params.id}")`)
    })
    .catch(e => res.json({code:500, message:"DB error"}))
});

//I should use streams
router.get('/guilds/:id/chart', auth, isAdmin, (req, res)  => {
    TrackModel.findOneAndUpdate({ guild_id: req.params.id }, { }, {upsert: true})
    .then((result) => {
        res.json({code: 0, chart: result.count_history});
    })
    .catch(e => res.json({code:500, message:"DB error"}))
});

module.exports = router;