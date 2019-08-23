const fs = require('fs');
const path = require('path');
const sendStats = require('./stats.js');
const { getAvailableLanguages, getGuildLanguage } = require('../utils/language.js');
const default_lang = process.env.DISCORD_DEFAULT_LANG;

module.exports = async (client, message) => {
    if (client.user.id !== message.author.id) {
        //load commands
        const commands = await new Promise((resolve, reject) => {
            fs.readdir(path.join(__dirname, "..", "commands/"), (err, files) => {
                let commands = [];
                if (err) reject(err);
                else {
                    files.forEach(command => {
                        commands.push(...require("../commands/" + command));
                    });
                    resolve(commands);
                }
            });
        });
        
        //get language object
        const guild_lang = await new Promise(async (resolve) => {
            if (message.guild) {
                const GuildLanguage = await getGuildLanguage(message.guild.id);
                const AvailableLanguages = await getAvailableLanguages();
                (AvailableLanguages.includes(GuildLanguage)) ? resolve(require(`../lang/${GuildLanguage}.json`)) : resolve(require(`../lang/${default_lang}.json`));  
            } else {
                resolve(require(`../lang/${default_lang}.json`));    
            }
        });

        const commandRequested = message.content.toLowerCase();

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
                        if (commandToCheck.allowedTypes.includes(message.channel.type)) {
                            commandToCheck.run(client, message, guild_lang);
                            console.log(`[Bot shard #${client.shard.id}] ${message.author.tag} (${message.author.id}) [${(message.guild) ? `Server: ${message.guild.name} (${message.guild.id}), ` : ""}${message.channel.type} (${message.channel.id})]: ${message.content}`)
                        } else {
                            message.channel.send(guild_lang.functions.commandHandler.invalid_channel.replace("{TYPE}", message.channel.type));
                        }
                    }
                }
            }
        }
    }
};