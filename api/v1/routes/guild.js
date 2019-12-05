const router = require("express").Router();
const Discord = require("discord.js");
const fetch = require("node-fetch");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const TrackModel = require("../../../mongooseModels/TrackModel");
const GuildModel = require("../../../mongooseModels/GuildModel");
const UserModel = require("../../../mongooseModels/UserModel");

//get available guilds (and check if the user has admin perms)
router.get("/guilds", auth, async (req, res) => {
    let guilds = await req.DiscordShardManager.broadcastEval(`
        Array.from(
            this.guilds
                .filter(guild => guild.members.has("${req.user.id}"))
                .map(guild => {
                    return {
                        name: guild.name,
                        id: guild.id,
                        icon: guild.icon
                    }
                })
        );
    `);

    guilds = await Promise.all(
        guilds.flat().filter(async guild => {
            let userHasPermissions = false;
            allowedRoles = await GuildModel.findOneAndUpdate(
                { guild_id: guild.id },
                {},
                { upsert: true, projection: { allowedRoles: 1 } }
            ).then(result => result.allowedRoles);
    
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
            
            await req.DiscordShardManager.broadcastEval(condition)
                .then(results => {
                    if (results.includes(true)) userHasPermissions = true;
                });
            return userHasPermissions;
        })
    );
    
    res.json(guilds);
});

//TODO get guild settings
router.get("/guilds/:guildId/settings", auth, isAdmin, (req, res) => {});

//TODO patch guild settings
router.patch("/guilds/:guildId/settings", auth, isAdmin, (req, res) => {});

//TODO patch upgrade server tier
router.patch("/guilds/:guildId/upgrade-server", auth, isAdmin, (req, res) => {});

//TODO return available counts
router.get("/guilds/:guildId/count-history", auth, isAdmin, (req, res) => {});

//TODO use json streams
router.get("/guilds/:guildId/count-history/:type", auth, isAdmin, (req, res) => {});

module.exports = router;
