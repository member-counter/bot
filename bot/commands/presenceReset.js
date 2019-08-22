const prefix = process.env.DISCORD_PREFIX;
const updateCounter = require('../utils/updateCounter');
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const Discord = require("discord.js");

const command = {
    name: "presenceReset",
    commands: [prefix+"presenceReset"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
        if (owners.includes(message.member.id)) {
            (new Discord.ShardClientUtil(client))
                .broadcastEval(`
                    this.user
                        .setPresence({
                            game: {
                                name: "type ${process.env.DISCORD_PREFIX}help",
                                type: "PLAYING"
                            }
                        })
                        .then(() => console.log("[Bot shard #${client.shard.id}] Presence updated successfully"))
                        .catch(console.error)
                `);
        }
    }
}

module.exports = command;