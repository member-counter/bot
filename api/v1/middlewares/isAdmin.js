const owners = process.env.BOT_OWNERS.split(/,\s?/);
const GuildModel = require("../../../mongooseModels/GuildModel");

//TODO test this
module.exports = (req, res, next) => {
    if (owners.includes(req.user.id)) {
        next();
    } else {
        GuildModel.findOneAndUpdate({ guild_id: req.params.guildId }, {}, { upsert: true, projection: { allowedRoles: 1 } })
            .then(guildSettings => {
                req.DiscordShardManager.broadcastEval(`
                    this.guild.get(${req.params.guildId})
                        .members.get(${req.user.id})
                            .permissions.has("ADMINISTRATOR")
                    ||
                    this.guild.get(${req.params.guildId})
                        .members.get(${req.user.id})
                            .roles.some(role => ${JSON.stringify(guildSettings.allowedRoles)}.includes(role.id))
                `)
                    .then(results => {
                        if (results.includes(true)) next();
                    })
            })
            .catch(error => {
                res.send({ code: 500, error: "Internal server error" });
                console.error(error);
            }); 
    }
};
