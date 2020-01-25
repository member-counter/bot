const { loadLanguagePack } = require("./utils/commandHandlerUtils");
const fetchGuildSettings = require("./utils/fetchGuildSettings");
const memberHasPermission = require("./utils/memberHasPermissions");
const channelTypeToString = require("./utils/channelTypeToString");

// Commands
const apiCommands = require('./commands/api');
const countCommands = require('./commands/counts');
const helpCommands = require('./commands/help');
const infoCommands = require('./commands/info');
const settingsCommands = require('./commands/settings');
const statusCommands = require('./commands/status');
const userCommands = require('./commands/user');

const { DISCORD_PREFIX, DISCORD_DEFAULT_LANG } = process.env;

const commands = [ ...apiCommands, ...countCommands, ...helpCommands, ...infoCommands, ...settingsCommands, ...statusCommands, ...userCommands ];

module.exports = async (bot, message) => {
    const { client } = bot;
    const { channel, author, content, member } = message;
    const { guild } = channel;

    //avoid responding to itself and to other bots
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

        if (commandRequested.startsWith(prefix.toLowerCase())) {
            commandsToCheckLoop:
            for (let i = 0; i < commands.length; i++) {
                const commandToCheck = commands[i];

                //loop over the command variants
                for (let ii = 0, cachedLengthII = commandToCheck.variants.length; ii < cachedLengthII; ii++) {
                    let commandToCheckVariant = prefix.toLowerCase()+commandToCheck.variants[ii].toLowerCase();

                    if (commandRequested.startsWith(commandToCheckVariant)) {
                        if (commandToCheck.allowedTypes.includes(channel.type)) {
                            //if the channel type is text||news, and the command needs admin perms, user has permissions to run the command? and if the last one is no, throw an error message and dont run the command
                            if ((channel.type === 0 || channel.type === 5) && commandToCheck.requiresAdmin && !memberHasPermission(member, guildSettings)) {
                                client.createMessage(channel.id, languagePack.common.error_no_admin).catch(console.error);
                                break commandsToCheckLoop;
                            } else {
                                console.log(`${author.username}#${author.discriminator} (${author.id}) [${guild ? `Server: ${guild.name} (${guild.id}), ` : ``}${channel.name? `Channel: ${channel.name}, ` : ``}Channel type: ${channelTypeToString(channel.type)} (${channel.id})]: ${content}`);
                                commandToCheck.run({bot, message, guildSettings, languagePack });
                                break commandsToCheckLoop; 
                            }
                        } else {
                            client.createMessage(channel.id, languagePack.functions.commandHandler.invalid_channel.replace("{TYPE}", channelTypeToString(channel.type))).catch(console.error);
                            break commandsToCheckLoop; 
                        }
                    }
                }
            }
        }
    }
};