"use strict";
const fs = require('fs');
const path = require('path');
const sendStats = require('./stats.js');
const GuildModel = require("../../mongooseModels/GuildModel");
const { DISCORD_DEFAULT_LANG, DISCORD_PREFIX } = process.env;

const commands = []

module.exports = async message => {
    const { client, guild, channel, author, content } = message;
    let command_runnable = true;
    //avoid self respond
    if (client.user.id !== author.id) {
        //translation is an object that has all the strings that are sent by the bot to text channels
        let translation = require(`../lang/${DISCORD_DEFAULT_LANG}.json`);

        let guild_settings = {
            prefix: DISCORD_PREFIX,
        };

        //fetch guild settings
        if (guild) {
            guild_settings = await new Promise(resolve => {
                GuildModel.findOneAndUpdate({ guild_id: guild.id }, {}, { new: true, upsert: true })
                    .then(async guild_settings => {
                        if (await isTranslationAvailable(guild_settings.lang)) {
                            translation = require(`../lang/${guild_settings.lang}.json`);
                        }
                        resolve(guild_settings);
                    })
                    .catch(err => {
                        console.error(err);
                        command_runnable = false;
                        resolve();
                    });
            });
        }

        //load commands if they are not loaded
        if (commands.length === 0) 
            await new Promise(resolve => {
                fs.readdir(path.join(__dirname, "..", "commands/"), (err, files) => {
                    if (err) {
                        console.error(err);
                        command_runnable = false;
                        resolve();
                    }
                    else {
                        files.forEach(file => {
                            let commandSet = require("../commands/" + file);
                            //convert to an array
                            commandSet = Object.entries(commandSet).map(i => i = i[1]);
                            commands.push(...commandSet);
                        });
                        resolve();
                    }
                });
            });

        const commandRequested = content.toLowerCase();

        //commands loop
        if (command_runnable) {
            commands_loop:
            for (let i = 0; i < commands.length; i++) {
                const commandToCheck = commands[i];
                //command variants loop
                for (let ii = 0; ii < commandToCheck.variants.length; ii++) {
                    const commandVariant = commandToCheck.variants[ii].replace(/\{PREFIX\}/i, guild_settings.prefix).toLowerCase();
                    //check if the command must be at the start of the message or it can be anywhere
                    if (commandToCheck.indexZero ? commandRequested.startsWith(commandVariant) : commandRequested.includes(commandVariant)) {
                        sendStats(commandToCheck.name);
                        //check if the command is enabled and supported for the channel type and then run it
                        if (commandToCheck.enabled) {
                            if (commandToCheck.allowedTypes.includes(channel.type)) {
                                commandToCheck.run({ message, guild_settings, translation });
                                console.log(`[Bot shard #${client.shard.id}] ${author.tag} (${author.id}) [${guild ? `Server: ${guild.name} (${guild.id}), ` : ``}${channel.name? `Channel: ${channel.name}, ` : ``}Channel type: ${channel.type} (${channel.id})]: ${content}`);
                                break commands_loop;
                            } else {
                                channel.send(translation.functions.commandHandler.invalid_channel.replace("{TYPE}", channel.type)).catch(console.error);
                            }
                        }
                    }
                }
            }
        }
    }
};

const isTranslationAvailable = lang_code => {
    return new Promise(resolve => {
        fs.readdir(path.join(__dirname, '..', 'lang/'), (err, files) => {
            if (err) resolve(false);
            else {
                const availableLangs = files.map((file) => file = file.split('.')[0]);
                resolve(availableLangs.includes(lang_code));
            }
        });
    });
};