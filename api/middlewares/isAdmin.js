const Discord = require('discord.js');
const fetch = require('node-fetch');
const owners = process.env.BOT_OWNERS.split(/,\s?/);

module.exports = (req, res, next) => {
    if (owners.includes(req.userId)) { next() }
    else {
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
                            if ((new Discord.Permissions(guild.permissions)).has('ADMINISTRATOR')) next();
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
}