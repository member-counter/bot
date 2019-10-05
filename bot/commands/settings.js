const GuildModel = require("../../mongooseModels/GuildModel");
const getLanguages = require("../utils/getLanguages");

const seeSettings = {
    name: "seeSettings",
    variants: ["{PREFIX}seeSettings"],
    allowedTypes: ["text"],
    indexZero: true, 
    enabled: true,
    run: ({ message, guild_settings, translation }) => {
        const { guild, channel } = message;
        const {
            lang_text,
            prefix_text,
            header_text,
            enabled_channel_name_counters_text,
            misc_type,
            enabled_channel_topic_counters_text,
            main_topic_text,
            custom_topics_by_channel_text,
            custom_numbers_text
        } = translation.commands.seeSettings.settings_message;
        const {
            prefix,
            lang,
            channelNameCounter,
            channelNameCounter_types,
            enabled_channels,
            unique_topics,
            topic,
            custom_numbers
        } = guild_settings;

        let messageToSend = "";
        
        messageToSend += `${header_text} ${guild.name} \`(${guild.id})\`\n\n`;
        
        //prefix and language

        messageToSend += `${prefix_text} ${prefix}\n`;
        messageToSend += `${lang_text} \`${lang}\` \\➡ ${translation.lang_name}\n`;

        //channel name counters:
        if (channelNameCounter.size > 0) {
            messageToSend += `${enabled_channel_name_counters_text}\n`;

            channelNameCounter.forEach((channel_name, channel_id) => {
                messageToSend += `\\• <#${channel_id}> \`(${channel_id})\` \\➡ ${misc_type} \`${channelNameCounter_types.has(channel_id) ? channelNameCounter_types.get(channel_id) : "members"}\` \n`;    
            });
            
            messageToSend += "\n";
        }

        //Enabled channel topic counters:
        if (enabled_channels.length > 0) {
            messageToSend += `${enabled_channel_topic_counters_text}\n`;

            enabled_channels.forEach((channel_id) => {
                messageToSend +=`\\• <#${channel_id}> \`(${channel_id})\`\n`;    
            });

            messageToSend += "\n";
        }

        //Main topic for topic counters
        messageToSend += `${main_topic_text} \`\`\`${topic}\`\`\``;

        if (unique_topics.size > 0) {
            //Custom topics by channel
            messageToSend += `${custom_topics_by_channel_text}\n`;

            unique_topics.forEach((channel_topic, channel_id) => {
                messageToSend +=`\\• <#${channel_id}> \`(${channel_id})\` \\➡ ${channel_topic}\n`;    
            });
        }

        //numbers
        messageToSend += `\n${custom_numbers_text} <a:0G:469275067969306634> \n`;

        Object.entries(custom_numbers.toObject()).forEach((number, i) => {
            messageToSend +=`${i} \\➡ ${number[1]}\n`;
        });

        //send in various messages
        messageToSend.splitSlice(2000).forEach(part => {
            channel.send(part).catch(console.error);
        })
    }
}

const resetSettings = {
    name: "resetSettings",
    variants: ["{PREFIX}resetSettings"],
    allowedTypes: ["text"],
    indexZero: true, 
    enabled: true,
    run: ({ message, guild_settings, translation }) => {
        const { client, guild, channel, member  } = message;
        if (member.hasPermission('ADMINISTRATOR') || owners.includes(member.id)) {
            GuildModel.findOneAndRemove({ guild_id: guild.id })
                .then(() => { 
                //leave empty all channel topics
                guild_settings.enabled_channels.forEach(channel_id => {
                    if (client.channels.has(channel_id)) {
                        client.channels.get(channel_id).setTopic('').catch(e => {
                            //ignore errors caused by permissions 
                            if (!(e.code === 50013 || e.code === 50001)) console.error(e);
                        });
                    }
                });
                
                //delete all channel name counters
                guild_settings.channelNameCounter.forEach((channel_name, channel_id) => {
                    if (client.channels.has(channel_id)) {
                        client.channels.get(channel_id).delete().catch(e => {
                            //ignore errors caused by permissions 
                            if (!(e.code === 50013 || e.code === 50001)) console.error(e);
                        });
                    }
                });

                channel.send(translation.commands.resetSettings.done).catch(console.error);
            })
            .catch(error => {
                console.error(error);
                channel.send(translation.common.error_db).catch(console.error);
            })
        } else {
            channel.send(translation.common.error_no_admin).catch(console.error)
        }
    }
}

const lang = {
    name: "lang",
    variants: ["{PREFIX}lang"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: async ({ message, guild_settings, translation }) => {
        const { content, channel, member } = message;
        if (member.hasPermission('ADMINISTRATOR') || owners.includes(member.id)) {
            const args = content.split(/\s+/);
            const lang_code = args[1];
            const languages = await getLanguages();
            if (languages.has(lang_code)) {
                guild_settings.lang = lang_code;
                guild_settings
                    .save()
                    .then(() => {
                        channel.send(languages.get(lang_code).commands.lang.success).catch(console.error);
                    })
                    .catch(error => {
                        console.error(error);
                        channel.send(translation.common.error_db).catch(console.error);
                    });
            } else {
                let messageToSend = translation.commands.lang.error_not_found + "\n";
                messageToSend += "```fix\n"
                languages.forEach((value, lang_code) => {
                    messageToSend += lang_code + " ➡ " + value.lang_name + "\n";
                });
                messageToSend += "```"
                channel.send(messageToSend).catch(console.error);
            }
        }
    }
};

const prefix = {
    name: "prefix",
    variants: ["{PREFIX}prefix"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: ({ message, guild_settings, translation }) => {
        const { channel, content, member } = message;
        if (member.hasPermission('ADMINISTRATOR') || owners.includes(member.id)) {
            const args = content.split(/\s+/g);
            guild_settings.prefix = args[1] ? args[1] : guild_settings.prefix;
            guild_settings
                .save()
                .then(() => {
                    channel.send(translation.commands.prefix.success.replace("{NEW_PREFIX}", guild_settings.prefix)).catch(console.error);
                })
                .catch(error => {
                    console.error(error);
                    channel.send(translation.common.error_db).catch(console.error);
                });
        }
    }
};

module.exports = { seeSettings, resetSettings, prefix, lang };

//I took this from https://jsperf.com/string-split-by-length/9
String.prototype.splitSlice = function (len) {
    let result = [];
    for (let offset = 0, strLen = this.length; offset < strLen; offset += len) {
        result.push(this.slice(offset, len + offset));
    }
    return result;
}
