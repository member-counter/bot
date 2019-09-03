const fs = require('fs');
const path = require('path');
const sendStats = require('./stats.js');
const { getAvailableLanguages, getGuildLanguage } = require('../utils/language.js');
const default_lang = process.env.DISCORD_DEFAULT_LANG;

module.exports = async (client, message) => {
    const { author, channel, guild, content } = message;

    if (client.user.id !== author.id) {
        //get translation object
        const translation = await new Promise(async resolve => {
            if (guild) {
                const GuildLanguage = await getGuildLanguage(guild.id);
                const AvailableLanguages = await getAvailableLanguages();
                (AvailableLanguages.includes(GuildLanguage)) ? resolve(require(`../lang/${GuildLanguage}.json`)) : resolve(require(`../lang/${default_lang}.json`));  
            } else {
                resolve(require(`../lang/${default_lang}.json`));    
            }
        });

        //load commands
        const commands = await new Promise(resolve => {
            fs.readdir(path.join(__dirname, "..", "commands/"), (err, files) => {
                let commands = [];
                if (err) {
                    console.error(err);
                    channel.send(translation.common.error_unknown).catch(console.error);
                    resolve(commands);
                }
                else {
                    files.forEach(command => {
                        commands.push(...require("../commands/" + command));
                    });
                    resolve(commands);
                }
            });
        });

        const commandRequested = content.toLowerCase();

        //commands loop
        for (let i = 0; i < commands.length; i++) {
            const commandToCheck = commands[i];
            //variants loop
            for (let ii = 0; ii < commandToCheck.commands.length; ii++) {
                const commandVariant = commandToCheck.commands[ii].toLowerCase();
                //check if the message contains the command
                if ((commandToCheck.indexZero) ? commandRequested.indexOf(commandVariant) === 0 : commandRequested.indexOf(commandVariant) > -1 ) {
                    sendStats(commandToCheck.name);
                    //check if the command is enabled and supported for the channel type and then run it
                    if (commandToCheck.enabled) {
                        if (commandToCheck.allowedTypes.includes(channel.type)) {
                            commandToCheck.run(client, message, translation);
                            console.log(`[Bot shard #${client.shard.id}] ${author.tag} (${author.id}) [${(guild) ? `Server: ${guild.name} (${guild.id}), ` : ``}${(channel.name) ? `Channel: ${channel.name}, ` : ``}Channel type: ${channel.type} (${channel.id})]: ${content}`)
                        } else {
                            channel.send(translation.functions.commandHandler.invalid_channel.replace("{TYPE}", channel.type));
                        }
                    }
                }
            }
        }
    }
};