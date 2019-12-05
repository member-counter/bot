const owners = process.env.BOT_OWNERS.split(/,\s?/);
const GuildModel = require("../../../mongooseModels/GuildModel");

module.exports = (req, res, next) => {
    if (owners.includes(req.user.id)) {
        next();
    } else {
        GuildModel.findOneAndUpdate({ guild_id: req.params.guildId }, {}, { upsert: true, projection: { allowedRoles: 1 } })
            .then(guildSettings => {
                const condition = `
                    (() => {
                        const guildId = "${guild.id}",
                            userId = "${req.user.id}",
                            allowedRoles = ${JSON.stringify(allowedRoles)}; 
                        if (this.guilds.has(guildId) && this.guilds.get(guildId).members.has(userId)) {
                            const member = this.guilds.get(guildId).members.get(userId);
                            return (
                                member.permissions.has("ADMINISTRATOR")
                                ||
                                member.roles.some(role => allowedRoles.includes(role.id))
                            );
                        } else {
                            return false;
                        }
                    })();
                `;

                req.DiscordShardManager.broadcastEval(condition)
                    .then(results => {
                        if (results.includes(true)) next();
                        else { res.status(403).json({ error: "You are not authorized to perform actions on this discord server" }); }
                    });
            })
            .catch(error => {
                res.status(500).json({ error: "Internal server error" });
                console.error(error);
            }); 
    }
};
