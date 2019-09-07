const seeSettings = {
    name: "seeSettings",
    variants: ["{PREFIX}seeSettings"],
    allowedTypes: ["text"],
    indexZero: true, 
    enabled: true,
    run: ({ client, message, guild_settings, translation }) => {
        const {
            header_text,
            enabled_channel_name_counters_text,
            enabled_channel_topic_counters_text,
            main_topic_text,
            custom_topics_by_channel_text
        } = translation.commands.seeSettings.settings_message;

        let messageToSend = "";
        
        messageToSend += `${header_text} ${message.guild.name} \u0060(${message.guild.id})\u0060\n\n`;

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
            message.channel.send(part).catch(console.error);
        })
    }
}

const resetSettings = {
    name: "resetSettings",
    variants: ["{PREFIX}resetSettings"],
    allowedTypes: ["text"],
    indexZero: true, 
    enabled: true,
    run: ({ client, message, guild_settings, translation }) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
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

            message.channel.send(translation.commands.resetSettings.done).catch(console.error);
        } else {
            message.channel.send(translation.commands.common.error_no_admin).catch(console.error)
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
    let ret = [];
    for (let offset = 0, strLen = this.length; offset < strLen; offset += len) {
      ret.push(this.slice(offset, len + offset));
    }
    return ret;
}
