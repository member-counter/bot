const Discord = require("discord.js");
const fetch = require("node-fetch");
const owners = process.env.BOT_OWNERS.split(/,\s?/);

module.exports = (req, res, next) => {
    if (owners.includes(req.user.id)) {
        next();
    } else {
        fetch(`https://discordapp.com/api/v6/users/@me/guilds`, {
            headers: { Authorization: req.headers.authorization }
        })
            .then(response => {
                const { status } = response;
                if (status === 200) {
                    return r.json();
                } else if (status === 401) {
                    res.json({ code: 401, message: "Bad token" });
                } else {
                    res.json({ code: 500, message: "Backend error" });
                }
            })
            .then(guilds => {
                const guilds_id = guilds.map(guild => guild = guild.id);
                if (guilds_id.includes(req.params.id)) {
                    guilds.forEach(guild => {
                        if (guild.id === req.params.id) {
                            const guildPermissions = new Discord.Permissions(guild.permissions);
                            if (guildPermissions.has("ADMINISTRATOR")) next();
                            else res.json({ code: 401, message: "Not authorized" });
                        }
                    });
                } else res.json({ code: 401, message: "Not authorized" });
            })
            .catch(error => {
                console.error(error);
                res.json({ code: 500, message: "Backend error" });
            });
    }
};
