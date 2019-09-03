const fs = require('fs');
const path = require('path');
const sendStats = require('./stats.js');
const { getAvailableLanguages, getGuildLanguage } = require('../utils/language.js');
const default_lang = process.env.DISCORD_DEFAULT_LANG;

//DELETE
//FIX
let translation = require("../lang/en_US.json")
let guild_settings = {
    prefix: "mcd!"
}

const commands = []

module.exports = async (client, message) => {
    const { author, channel, guild, content } = message;
    //avoid self respond
    if (client.user.id !== author.id) {
        //load commands if they are not loaded
        if (commands.length === 0) 
            await new Promise(resolve => {
                fs.readdir(path.join(__dirname, "..", "commands/"), (err, files) => {
                    if (err) {
                        console.error(err);
                        channel.send(translation.common.error_unknown).catch(console.error);
                        resolve();
                    }
                    else {
                        files.forEach(command => {
                            commands.push(...require("../commands/" + command));
                        });
                        resolve();
                    }
                });
            });

        const commandRequested = content.toLowerCase();

        //commands loop
        commands_loop:
        for (let i = 0; i < commands.length; i++) {
            const commandToCheck = commands[i];
            //command variants loop
            for (let ii = 0; ii < commandToCheck.variants.length; ii++) {
                const commandVariant = commandToCheck.variants[ii].replace(/\{PREFIX\}/i, guild_settings.prefix).toLowerCase();
                //check if it must be at the start of the message or it can be anywhere
                if (commandToCheck.indexZero ? commandRequested.startsWith(commandVariant) : commandRequested.contains(commandVariant)) {
                    sendStats(commandToCheck.name);
                    //check if the command is enabled and supported for the channel type and then run it
                    if (commandToCheck.enabled) {
                        if (commandToCheck.allowedTypes.includes(channel.type)) {
                            commandToCheck.run({ client, message, guild_settings, translation });
                            console.log(`[Bot shard #${client.shard.id}] ${author.tag} (${author.id}) [${guild ? `Server: ${guild.name} (${guild.id}), ` : ``}${channel.name? `Channel: ${channel.name}, ` : ``}Channel type: ${channel.type} (${channel.id})]: ${content}`);
                            break commands_loop;
                        } else {
                            channel.send(translation.functions.commandHandler.invalid_channel.replace("{TYPE}",channel.type)).catch(console.error);
                        }
                    }
                }
            }
        }
    }
};

String.prototype.startsWith = function(str) {
    return this.indexOf(str) === 0;
}

String.prototype.contains = function(str) {
    return this.indexOf(str) > -1;
}
