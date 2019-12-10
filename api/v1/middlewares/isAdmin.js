const owners = process.env.BOT_OWNERS.split(/,\s?/);
const fetchGuildSettings = require("../../../bot/utils/fetchGuildSettings");

//check if the user is admin or has permission in the guild that is trying to access req.params.guildId
module.exports = (req, res, next) => {
    if (owners.includes(req.token.id)) {
        next();
    } else {
        fetchGuildSettings(req.params.guildId)
            .then(guildSettings => {
                const condition = `
                    (() => {
                        const guildId = base64.decode("${base64.encode(req.params.guildId)}"),
                            userId = base64.decode("${base64.encode(req.token.id)}"),
                            allowedRoles = ${JSON.stringify(guildSettings.allowedRoles)};
                            
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
                        else { res.status(403).json({ message: "You are not authorized to perform actions on this discord server" }); }
                    });
            })
            .catch(error => {
                res.status(500).json({ message: "DB Error" });
                console.error(error);
            }); 
    }
};
