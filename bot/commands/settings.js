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
            prefix_text,
            header_text,
            enabled_channel_name_counters_text,
            misc_type,
            enabled_channel_topic_counters_text,
            main_topic_text,
            custom_topics_by_channel_text
        } = translation.commands.seeSettings.settings_message;
        const {
            prefix,
            lang,
            channelNameCounter,
            channelNameCounter_types,
            enabled_channels,
            unique_topics,
            topic
        } = guild_settings;

        let messageToSend = "";
        
        messageToSend += `${header_text} ${guild.name} \u0060(${guild.id})\u0060\n\n`;
        
        //prefix and language

        messageToSend += `${prefix_text} ${prefix}\n`;

        //channel name counters:
        if (channelNameCounter.size > 0) {
            messageToSend += `${enabled_channel_name_counters_text}\n`;

            channelNameCounter.forEach((channel_name, channel_id) => {
                messageToSend += `\\• <#${channel_id}> \u0060(${channel_id})\u0060 \\➡ ${misc_type} \u0060${channelNameCounter_types.has(channel_id) ? channelNameCounter_types.get(channel_id) : "members"}\u0060 \n`;    
            });
            
            messageToSend += "\n";
        }

        //Enabled channel topic counters:
        if (enabled_channels.length > 0) {
            messageToSend += `${enabled_channel_topic_counters_text}\n`;

            enabled_channels.forEach((channel_id) => {
                messageToSend +=`\\• <#${channel_id}> \u0060(${channel_id})\u0060\n`;    
            });

            messageToSend += "\n";
        }

        //Main topic for topic counters
        messageToSend += `${main_topic_text} \u0060\u0060\u0060${topic}\u0060\u0060\u0060\n`;

        if (unique_topics.size > 0) {
            //Custom topics by channel
            messageToSend += `${custom_topics_by_channel_text}\n`;

            unique_topics.forEach((channel_topic, channel_id) => {
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

//TODO
const lang = {}

const prefix = {
    name: "prefix",
    variants: ["{PREFIX}prefix"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: ({ message, guild_settings, translation }) => {
        const { channel, content } = message;
        const args = content.split(/\s+/g);
        guild_settings.prefix = args[1];
        guild_settings
            .save()
            .then(() => {
                channel.send(translation.commands.prefix.success.replace("{NEW_PREFIX}", args[1])).catch(console.error);
            })
            .catch(error => {
                console.error(error);
                channel.send(translation.common.error_db).catch(console.error);
            });
    }
};

module.exports = { seeSettings, resetSettings, prefix };

//I took this from https://jsperf.com/string-split-by-length/9
String.prototype.splitSlice = function (len) {
    let result = [];
    for (let offset = 0, strLen = this.length; offset < strLen; offset += len) {
        result.push(this.slice(offset, len + offset));
    }
    return result;
}
