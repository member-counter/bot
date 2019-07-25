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
    .then(r => {
        r.forEach(guild => {
            if (guild.id=== req.params.id) {
                console.log(1)
                if ((new Discord.Permissions(guild.permissions)).hasPermission('ADMINISTRATOR')) next();
                else res.json({code: 401, message: "Not authorized"})
            }
        });
        console.log(2);
        
        res.json({code: 401, message: "Not authorized"})
    })
    .catch(() => {
        res.json({code:500, message:"Backend error"})
    });  
}

router.get('/guild/:id', auth, isAdmin, (req, res)  => {
    
});

router.patch('/guild/:id', auth, isAdmin, (req, res)  => {
    
});

router.get('/guild/:id/chart', auth, isAdmin, (req, res)  => {
    
});

module.exports = router;