const GuildModel = require("../../mongooseModels/GuildModel");

const seeSettings = {
    name: "seeSettings",
    variants: ["{PREFIX}seeSettings"],
    allowedTypes: ["text"],
    indexZero: true, 
    enabled: true,
    run: ({ message, guild_settings, translation }) => {
        const { guild, channel } = message;
        const {
            header_text,
            enabled_channel_name_counters_text,
            enabled_channel_topic_counters_text,
            main_topic_text,
            custom_topics_by_channel_text
        } = translation.commands.seeSettings.settings_message;

        let messageToSend = "";
        
        messageToSend += `${header_text} ${guild.name} \u0060(${guild.id})\u0060\n\n`;

        //Enabled channel name counters:
        if (guild_settings.channelNameCounter.size > 0) {
            messageToSend += `${enabled_channel_name_counters_text}\n`;

            guild_settings.channelNameCounter.forEach((channel_name, channel_id) => {
                messageToSend += `\\• <#${channel_id}> \u0060(${channel_id})\u0060 \\➡ ${channel_name}\n`;    
            });
            
            messageToSend += "\n";
        }

        //Enabled channel topic counters:
        if (guild_settings.enabled_channels.length > 0) {
            messageToSend += `${enabled_channel_topic_counters_text}\n`;

            guild_settings.enabled_channels.forEach((channel_id) => {
                messageToSend +=`\\• <#${channel_id}> \u0060(${channel_id})\u0060\n`;    
            });

            messageToSend += "\n";
        }

        //Main topic for topic counters
        messageToSend += `${main_topic_text} \u0060\u0060\u0060${guild_settings.topic}\u0060\u0060\u0060\n`;

        if (guild_settings.unique_topics.size > 0) {
            //Custom topics by channel
            messageToSend += `${custom_topics_by_channel_text}\n`;

            guild_settings.unique_topics.forEach((channel_topic, channel_id) => {
                messageToSend +=`\\• <#${channel_id}> \u0060(${channel_id})\u0060 \\➡ ${channel_topic}\n`;    
            });
        }

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
        const { client, channel, member  } = message;
        if (member.hasPermission('ADMINISTRATOR') || owners.includes(member.id)) {
            GuildModel.findOneAndRemove({ guild_id:message.guild.id })
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
                message.channel.send(translation.common.error_db).catch(console.error);
            })
        } else {
            channel.send(translation.common.error_no_admin).catch(console.error)
        }
    }
}

//TODO
const lang = {}

//TODO
const prefix = {}

module.exports = { seeSettings, resetSettings };

//I took this from https://jsperf.com/string-split-by-length/9
String.prototype.splitSlice = function (len) {
    let result = [];
    for (let offset = 0, strLen = this.length; offset < strLen; offset += len) {
        result.push(this.slice(offset, len + offset));
    }
    return result;
}
