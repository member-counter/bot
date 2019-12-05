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
                .filter(guild => guild.members.has("${req.token.id}"))
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
                { new: true, upsert: true, projection: { allowedRoles: 1 } }
            )
                .then(result => result.allowedRoles)
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ message: "DB Error" });
                });
    
            const condition = `
                (() => {
                    const guildId = "${guild.id}",
                        userId = "${req.token.id}",
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
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ message: "I couldn't fetch the discord servers" });
                });
            return userHasPermissions;
        })
    );
    
    res.json(guilds);
});

router.get("/guilds/:guildId", auth, isAdmin, async (req, res) => {
    const guildSettings = await GuildModel.findOneAndUpdate({ guild_id: req.params.guildId }, {}, { new: true, upsert: true, projection: { _id: 0, __v: 0 } })
        .then(doc => doc.toObject())        
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "DB Error" });
        });

    res.json(guildSettings);
});

//patch guild settings
router.patch("/guilds/:guildId", auth, isAdmin, async (req, res) => {
    let settingsToSet = req.body;
    delete settingsToSet.premium_status;
    delete settingsToSet._id;
    delete settingsToSet.__v;
    delete settingsToSet.guild_id;

    await GuildModel.findOneAndUpdate({ guild_id: req.params.guildId }, { $set: settingsToSet }, { new: true, upsert: true })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "DB Error" });
        });

    res.json({ message: "Changes done." });
});


router.get("/guilds/:guildId/discord-roles", auth, isAdmin, async (req, res) => {
    const roles = await req.DiscordShardManager.broadcastEval(`
        (() => {
            const guildId = "${req.params.guildId}";
            if (this.guilds.has(guildId)) {
                return this.guilds.get(guildId).roles.array();
            }
        })();
    `)
        .then(results => {
            let roles = results
                .flat()
                .filter(role => typeof role === "object")
                .map(role => ({
                    id: role.id,
                    name: role.name,
                    color: role.color,
                    position: role.position
                }));

            return roles;
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "I couldn't fetch the roles" });
        });

    res.json(roles);
});

//patch upgrade server tier
router.patch("/guilds/:guildId/upgrade-server", auth, isAdmin, async (req, res) => {
    let guildSettings = await GuildModel.findOneAndUpdate({ guild_id: req.params.guildId }, {}, { new: true, upsert: true, projection: { premium_status: 1 } })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "DB Error" });
        });

    let userDoc = await UserModel.findOneAndUpdate({ user_id: req.token.id }, { }, { new: true, upsert: true});

    if (userDoc.premium) {
        if (guildSettings.premium_status < 2) {
            guildSettings.premium_status = 2;
            guildSettings.save()
                .then(() => {
                    res.json({ message: "Done, server upgraded to high tier"});
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ message: "DB Error" });
                });
        } else {
            res.status(409).json({ message: "You can't upgrade the premium level because the server already has the same or a higher tier." });
        }
    } else if (userDoc.available_points > 0) {
        if (guildSettings.premium_status < 1) {
            guildSettings.premium_status = 1;
            guildSettings.save()
                .then(() => {
                    userDoc.available_points--;
                    return userDoc.save();
                })
                .then(() => {
                    res.json({ message: "Done, server upgraded to low tier", points_left: userDoc.available_points});
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ message: "DB Error" });
                });

        } else {
            res.status(409).json({ message: "You can't upgrade the premium level because the server already has the same or a higher tier." });
        }
    } else {
        res.status(409).json({ message: "You have no more points to spend" });
    }
});

//return available counts
router.get("/guilds/:guildId/count-history", auth, isAdmin, async (req, res) => {
    res.json(await TrackModel.distinct("type", { guild_id: req.params.guildId}));
});

//TODO use json streams
router.get("/guilds/:guildId/count-history/:type", auth, isAdmin, (req, res) => {});

module.exports = router;
