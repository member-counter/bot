const fs = require('fs');
const path = require('path');
const sendStats = require('./stats.js');
const { getAvailableLanguages, getGuildLanguage } = require('../utils/language.js');
const default_lang = process.env.DEFAULT_LANG;

const loadCommands = () => {
    return new Promise((resolve, reject)=>{
        fs.readdir(path.join(__dirname, '..', 'commands/'), (err, files) => {
            let commands = []; 
            if (err) reject(err);
            else {
                files.forEach((element)=>{
                    commands.push(require("../commands/"+element));
                })
                resolve(commands);
            }
        })
    })
}

module.exports = async (client, message) => {
    commandList = await loadCommands();
    for (let i = 0; i < commandList.length; i++) {
        const command = commandList[i];
        for (let e = 0; e < command.commands.length; e++) {
            const indexZeroCheck = (command.indexZero) ? message.content.toLowerCase().indexOf(command.commands[e].toLowerCase()) === 0 : message.content.toLowerCase().indexOf(command.commands[e].toLowerCase()) > -1;
            if (command.enabled && indexZeroCheck) {
                //Send stats
                sendStats(command.name);

                //Check which language will be used
                let ResultLang = default_lang;
                
                if (message.guild) {
                    const GuildLanguage = await getGuildLanguage(message.guild.id);
                    const AvailableLanguages = await getAvailableLanguages();
                    
                    for (let L = 0; L < AvailableLanguages.length; L++) {
                        if (AvailableLanguages[L] == GuildLanguage) {
                            ResultLang = GuildLanguage;
                            break;
                        }
                    }
                }

                console.log(`${message.author.tag} (${message.author.id}) [${(message.guild) ? `Server: ${message.guild.name} (${message.guild.id}), ` : ""}${message.channel.type} Channel: ${message.channel.name} (${message.channel.id})]: ${message.content}`)
                
                //Run the command
                command.run(client, message, require(`../lang/${ResultLang}.json`));
                break;
            }
        }
    }
}