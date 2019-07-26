const router = require('express').Router();
const auth = require('../auth');
const GuildModel = require('../../mongooseModels/GuildModel');
const TrackModel = require('../../mongooseModels/TrackModel');
const Discord = require('discord.js');
const fetch = require('node-fetch');

const isAdmin = (req, res, next) => {
    fetch(`https://discordapp.com/api/v6/users/@me/guilds`, { headers: { 'Authorization' : req.headers.authorization } })
    .then(r => {
        if (r.status === 200) return r.json();
        else if (r.status === 401) res.json({code:401, message:"Bad token"});
        else res.json({code:500, message:"Backend error"}) 
    })
    .then(doc => {
        if (doc.map(x => x = x.id).includes(req.params.id)) {
            doc.forEach(guild => {
                if (guild.id === req.params.id) {
                    if ((new Discord.Permissions(guild.permissions)).has('ADMINISTRATOR')   ) next();
                    else res.json({code: 401, message: "Not authorized"})
                }
            });
        } else {
            res.json({code: 401, message: "Not authorized"})
        }
    })
    .catch(() => {
        res.json({code:500, message:"Backend error"})
    });  
}

router.get('/guild/:id', auth, isAdmin, (req, res)  => {
    GuildModel.findOne({ guild_id: req.params.id }, { _id: 0, __v: 0 })
    .then(guild => res.json(guild))
    .catch(e => res.json({code:500, message:"Backend error"}))
});

router.patch('/guild/:id', auth, isAdmin, (req, res)  => {
    delete req.body.__v;
    delete req.body._id;
    GuildModel.findOneAndUpdate({ guild_id: req.params.id }, { ...req.body }, {upsert: true})
    .then((result)=>{
        res.json({code: 0, message: "Updated sucessfully"})
    })
    .catch(e => res.json({code:500, message:"Backend error"}))
});

router.get('/guild/:id/chart', auth, isAdmin, (req, res)  => {
    TrackModel.findOneAndUpdate({ guild_id: req.params.id }, { }, {upsert: true})
    .then((result)=>{
        res.json({code: 0, chart: result.count_history});
    })
    .catch(e => res.json({code:500, message:"Backend error"}))
});

module.exports = router;