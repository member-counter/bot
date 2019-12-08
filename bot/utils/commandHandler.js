const { loadCommands, loadLanguagePack } = require("./commandHandler/utils");
const fetchGuildSettings = require("../utils/fetchGuildSettings");
const memberHasPermission = require("./memberHasPermissions");
const sendStats = require('./stats.js');

const { DISCORD_PREFIX, DISCORD_DEFAULT_LANG } = process.env;

let commands = [];

//TODO guildSettings to guildSettings

module.exports = async message => {
    const { client, guild, channel, author, content, member } = message;

    //load commands if they are not
    if (commands.length === 0) commands = await loadCommands();
    
    //avoid responding to itself and other bots
    if ((client.user.id !== author.id) && !author.bot) {
        let prefix = DISCORD_PREFIX;
        let languagePack = await loadLanguagePack(DISCORD_DEFAULT_LANG);
        let guildSettings = { prefix };

        //if the command is sent from a guild, get its custom configurations
        if (guild) {
            guildSettings = await fetchGuildSettings(guild.id).catch(console.error);
            prefix = guildSettings.prefix;
            languagePack = await loadLanguagePack(guildSettings.lang);
        }

        const commandRequested = content.toLowerCase(); //case insensitive match

        commandsLoop:
        for (let i = 0; i < commands.length; i++) {
            const commandToCheck = commands[i];
            //loop over the command variants
            for (let ii = 0; ii < commandToCheck.variants.length; ii++) {
                //get the command variant and replace the {PREFIX} keyword by the actual prefix
                const commandVariant = commandToCheck.variants[ii].replace(/\{PREFIX\}/i, prefix).toLowerCase();
                //check if the command must be at the start of the message or it can be anywhere, then, check if it matches
                if (commandToCheck.indexZero ? commandRequested.startsWith(commandVariant) : commandRequested.includes(commandVariant)) {
                    sendStats(commandToCheck.name);
                    //check if the command is enabled and supported for the channel type and then run it
                    if (commandToCheck.enabled) {
                        if (commandToCheck.allowedTypes.includes(channel.type)) {
                            //if the channel type is text||news, and the command needs admin perms, user has permissions to run the command? and if the last one is no, throw an error message and dont run the command
                            if ((channel.type === "text" || channel.type === "news") && commandToCheck.requiresAdmin && !memberHasPermission(member, guildSettings)) {
                                channel.send(languagePack.common.error_no_admin).catch(console.error);
                                break commandsLoop; 
                            } else {
                                console.log(`[Bot shard #${client.shard.id}] ${author.tag} (${author.id}) [${guild ? `Server: ${guild.name} (${guild.id}), ` : ``}${channel.name? `Channel: ${channel.name}, ` : ``}Channel type: ${channel.type} (${channel.id})]: ${content}`);
                                commandToCheck.run({ message, guildSettings, languagePack });
                                break commandsLoop; 
                            }
                        } else {
                            channel.send(languagePack.functions.commandHandler.invalid_channel.replace("{TYPE}", channel.type)).catch(console.error);
                        }
                    }
                }
            }
        }
    }
};
