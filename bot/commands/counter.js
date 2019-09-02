const prefix = process.env.DISCORD_PREFIX;
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const GuildModel = require("../../mongooseModels/GuildModel");
const updateCounter = require("../utils/updateCounter");

const createChannelNameCounter = {
    name: "createChannelNameCounter",
    commands: [prefix+"createChannelNameCounter"],
    allowedTypes: ["text"],
    indexZero: true, 
    enabled: true,
    run: (client, message, translation) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            GuildModel.findOneAndUpdate({ guild_id:message.guild.id }, {}, {upsert: true, new: true})
                .then((guild_settings) => {
                    //extract topic, if you know a better way to do this, please, do a PR
                    let name = [];
                    message.content.split(" ").forEach((part, i) => {
                        if (i !== 0 && part !== "" ) name.push(part);
                    });

                    name = (name.length === 0) ? "Members: {COUNT}" : name.join(" ");

                    message.guild
                        .createChannel(name.replace(/\{COUNT\}/gi, message.guild.memberCount), {
                                type: "voice",
                                permissionOverwrites: [{
                                    id: message.guild.id,
                                    deny: ["CONNECT"]
                                }]
                            })
                            .then((voiceChannel) => {
                                guild_settings.channelNameCounter.set(voiceChannel.id, name);
                                guild_settings.save()
                                    .then(() => {
                                        message.channel.send(translation.commands.createChannelNameCounter.success).catch(console.error);
                                    })
                                    .catch((e) => {
                                        console.error(e)
                                        message.channel.send(translation.common.error_unknown).catch(console.error)
                                    })
                            })
                            .catch((e) => {
                                console.error(e);
                                if (e.code === 50013) message.channel.send(translation.commands.createChannelNameCounter.no_perms).catch(console.error);
                                else message.channel.send(translation.common.error_unknown).catch(console.error);
                            })
                    })
                    .catch((e) => {
                        console.error(e);
                        message.channel.send(translation.common.error_db).catch(console.error);
                    });
            }
        }
}

const enableTopicCounter = {
    name: "enableTopicCounter",
    commands: [prefix+"enableTopicCounter", prefix+"enable"],
    allowedTypes: ["text"],
    indexZero: true, 
    enabled: true,
    run: (client, message, translation) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            GuildModel.findOneAndUpdate({ guild_id:message.guild.id }, {}, {upsert: true, new: true})
                .then((guild_settings) => {
                    const args = message.content.split(" ");
                    let channelsToEnable = [];
                    if (message.mentions.channels.size > 0) {
                        channelsToEnable = message.mentions.channels.keyArray();
                    } else if (args[args.length - 1] === "all") {
                        channelsToEnable = message.guild.channels.filter(channel => channel.type === "text" || channel.type === "news").keyArray();
                    } else {
                        channelsToEnable = [message.channel.id]
                    }

                    channelsToEnable.forEach(channel_id => {
                        if (!guild_settings.enabled_channels.includes(channel_id)) guild_settings.enabled_channels.push(channel_id);
                    });

                    guild_settings.save()
                        .then(() => {
                            updateCounter(client, message.guild.id);
                            let channelsToMention = "";
                            channelsToEnable.forEach((channel, i) => {
                                channelsToMention += `${(i === 0) ? "" : " "}<#${channel}>${(i === channelsToEnable.length-1) ? '.' : ','}`; 
                            });
                            message.channel.send(translation.commands.enableTopicCounter.success.replace("{CHANNELS}", channelsToMention)).catch(console.error)
                        })
                        .catch((e) => {
                            console.error(e);
                            message.channel.send(translation.common.error_db).catch(console.error);
                        })
                })
                .catch((e) => {
                    console.error(e);
                    message.channel.send(translation.common.error_db).catch(console.error);
                });
        } else {
            message.channel.send(translation.commands.common.error_no_admin).catch(console.error)
        }
    }
}

const disableTopicCounter = {
    name: "disableTopicCounter",
    commands: [prefix+"disableTopicCounter", prefix+"disable"],
    allowedTypes: ["text"],
    indexZero: true, 
    enabled: true,
    run: (client, message, translation) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            GuildModel.findOneAndUpdate({ guild_id:message.guild.id }, {}, {upsert: true, new: true})
                .then((guild_settings) => {
                    const args = message.content.split(" ");
                    let channelsToDisable = [];
                    if (message.mentions.channels.size > 0) {
                        channelsToDisable = message.mentions.channels.keyArray();
                    } else if (args[args.length - 1] === "all") {
                        channelsToDisable = guild_settings.enabled_channels;
                    } else {
                        channelsToDisable = [message.channel.id]
                    }
                    guild_settings.enabled_channels = guild_settings.enabled_channels.filter(x => channelsToDisable.indexOf(x) === -1);
                    guild_settings.save()
                        .then(() => {
                            //leave the topic empty
                            channelsToDisable.forEach(channel_id => {
                                if (client.channels.has(channel_id)) client.channels.get(channel_id).setTopic('').catch(console.error);
                            })

                            let channelsMentioned = "";
                            channelsToDisable.forEach((channel, i) => {
                                channelsMentioned += `${(i === 0) ? "" : " "}<#${channel}>${(i === channelsToDisable.length-1) ? '.' : ','}`; 
                            });
                            message.channel.send(translation.commands.disableTopicCounter.success.replace("{CHANNELS}", channelsMentioned)).catch(console.error)
                        })
                        .catch((e) => {
                            console.error(e);
                            message.channel.send(translation.common.error_db).catch(console.error);
                        })
                })
                .catch((e) => {
                    console.error(e);
                    message.channel.send(translation.common.error_db).catch(console.error);
                });
        } else {
            message.channel.send(translation.commands.common.error_no_admin).catch(console.error)
        }
    }
}

const setTopic = {
    name: "setTopic",
    commands: [prefix+"setTopic"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: (client, message, translation) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            GuildModel.findOneAndUpdate({ guild_id:message.guild.id }, {}, { upsert:true, new: true })
                .then(guild_settings => {
                    if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
                        const args = message.content.split(" ");
                        let channelsToCustomize = [];
                        let newTopic = "";

                        //check if the topic must be setted for specific channels. No, I can't use message.mentions.channels because that could also include mentioned channels inside newTopic
                        for (let i = 0; i < args.length; i++) {
                            const arg = args[i];
                            if (i !== 0) {
                                if (arg !== "") {
                                    if (arg.slice(0, 2) === "<#" && arg.slice(-1) === ">") {
                                        let channel_id = arg.slice(2, -1);
                                        if (!channelsToCustomize.includes(channel_id)) channelsToCustomize.push(channel_id);
                                    } else break;
                                }
                            }
                        }

                        //extract topic
                        let sliceFrom;
                        for (let i = 0; i < args.length; i++) {
                            const arg = args[i];
                            if (i !== 0) {
                                if (!(arg === "" || /<#[0-9]+>/.test(arg))) {
                                    sliceFrom = i;
                                    break;
                                }
                            }
                        }
                        newTopic = args.slice(sliceFrom).join(" ");

                        //save changes
                        if (channelsToCustomize.length > 0 && sliceFrom !== undefined) {
                            channelsToCustomize.forEach(channel_id => guild_settings.unique_topics.set(channel_id, newTopic));
                            guild_settings.save()
                                .then(() => {
                                    updateCounter(client, message.guild.id);
                                    let msgChannels = "";
                                    channelsToCustomize.forEach((channel, i) => {
                                        msgChannels += `${(i === 0) ? "" : " "}<#${channel}>${(i === channelsToCustomize.length-1) ? '.' : ','}`; 
                                    });
                                    message.channel.send(translation.commands.setTopic.success_unique.replace("{CHANNELS}", msgChannels)).catch(console.error);
                                })
                                .catch((e) => {
                                    console.error(e);
                                    message.channel.send(translation.common.error_db).catch(console.error);
                                })
                        } else if (sliceFrom === undefined) {
                            //this happens when you run the command with mentioned channels but without a topic, like "prefix!setTopic #general"
                            message.channel.send(translation.commands.setTopic.no_topic.replace("{PREFIX}", prefix)).catch(console.error);
                        } else {
                            guild_settings.topic = newTopic;
                            guild_settings.save()
                                .then(() => {
                                    updateCounter(client, message.guild.id);
                                    message.channel.send(translation.commands.setTopic.success).catch(console.error);
                                })
                                .catch((e) => {
                                    console.error(e);
                                    message.channel.send(translation.common.error_db).catch(console.error);
                                })
                        }

                    }
                })
                .catch((e) => {
                    console.error(e);
                    message.channel.send(translation.common.error_db).catch(console.error);
                });
        } else {
            message.channel.send(translation.commands.common.error_no_admin).catch(console.error)
        }
    }
}

const removeTopic = {
    name: "removeTopic",
    commands: [prefix+"removeTopic"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: (client, message, translation) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            GuildModel.findOneAndUpdate({ guild_id:message.guild.id }, {}, { upsert:true, new: true })
                .then(guild_settings => {
                    const mentionedChannels = message.mentions.channels.keyArray();
                    if (mentionedChannels.length > 0) {
                        mentionedChannels.forEach(channel_id => {
                            guild_settings.unique_topics.delete(channel_id);
                        });
                        guild_settings.save()
                            .then(() => {
                                updateCounter(client, message.guild.id);
                                let stringMentionedChannels = "";
                                mentionedChannels.forEach((channel, i) => {
                                    stringMentionedChannels += `${(i === 0) ? "" : " "}<#${channel}>${(i === mentionedChannels.length-1) ? '.' : ','}`;
                                });
                                message.channel.send(translation.commands.removeTopic.success_unique.replace("{CHANNELS}", stringMentionedChannels)).catch(console.error);
                            })
                            .catch((e) => {
                                console.error(e);
                                message.channel.send(translation.common.error_db).catch(console.error);
                            })
                    } else {
                        guild_settings.topic = "Members: {COUNT}";
                        guild_settings.save()
                            .then(() => {
                                updateCounter(client, message.guild.id);
                                message.channel.send(translation.commands.removeTopic.success).catch(console.error);
                            })
                            .catch((e) => {
                                console.error(e);
                                message.channel.send(translation.common.error_db).catch(console.error);
                            })
                    }
                })
                .catch(e => {
                    console.error(e);
                    message.channel.send(translation.common.error_db).catch(console.error);
                })
        
        } else {
            message.channel.send(translation.commands.common.error_no_admin).catch(console.error)
        }
    }
}

const setDigit = {
    name: "setDigit",
    commands: [prefix+"setDigit"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: (client, message, translation) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            const args = message.content.split(/\s+/);
            if (args.length >= 3) {    
                const digitToUpdate = args[1].slice(0, 1);
                const newDigitValue = args[2];
                GuildModel.findOne({guild_id:message.guild.id})
                    .then((guild_settings) => {
                        guild_settings.custom_numbers[digitToUpdate] = newDigitValue
                        guild_settings.save()
                            .then(() => {
                                message.channel.send(translation.commands.setDigit.success).catch(console.error);
                                updateCounter(client, message.guild.id);
                            })
                            .catch((e) => {
                                console.error(e);
                                message.channel.send(translation.common.error_db).catch(console.error);
                            });
                    })
                    .catch((e) => {
                        console.error(e);
                        message.channel.send(translation.common.error_db).catch(console.error);
                    });
            } else {
                message.channel.send(translation.commands.setDigit.error_missing_params.replace("{PREFIX}", prefix)).catch(console.error)
            }
        } else {
            message.channel.send(translation.commands.common.error_no_admin).catch(console.error)
        }
    }
}

const update = {
    name: "update",
    commands: [prefix+"update"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: (client, message, translation) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            updateCounter(client, message.guild.id);
            message.channel.send(translation.commands.update.success).catch(console.error);
        } else {
            message.channel.send(translation.commands.common.error_no_admin).catch(console.error);
        }
    }
}

const seeSettings = {
    name: "seeSettings",
    commands: [prefix+"seeSettings"],
    allowedTypes: ["text"],
    indexZero: true, 
    enabled: true,
    run: (client, message, translation) => {
        GuildModel.findOneAndUpdate({ guild_id:message.guild.id }, {}, {upsert: true, new: true})   
            .then((guild_settings) => {
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
            })
            .catch((e) => {
                console.error(e);
                message.channel.send(translation.common.error_db).catch(console.error);
            });
    }
}

const resetSettings = {
    name: "resetSettings",
    commands: [prefix+"resetSettings"],
    allowedTypes: ["text"],
    indexZero: true, 
    enabled: true,
    run: (client, message, translation) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            GuildModel.findOneAndRemove({ guild_id:message.guild.id })
                .then((guild_settings) => { 
                    if (guild_settings) {
                        //leave empty all channel topics
                        guild_settings.enabled_channels.forEach(channel_id => {
                            if (client.channels.has(channel_id)) {
                                client.channels.get(channel_id).setTopic('').catch(e => {
                                    //ignore errors caused by permissions 
                                    if (e.code !== 50013 || e.code !== 50001) console.error(e);
                                });
                            }
                        });
                        
                        //delete all channel name counters
                        guild_settings.channelNameCounter.forEach((channel_name, channel_id) => {
                            if (client.channels.has(channel_id)) {
                                client.channels.get(channel_id).delete().catch(e => {
                                    //ignore errors caused by permissions 
                                    if (e.code !== 50013 || e.code !== 50001) console.error(e);
                                });
                            }
                        });
                    }

                    message.channel.send(translation.commands.resetSettings.done).catch(console.error);
                })
                .catch(e => {
                    console.error(e);
                    message.channel.send(translation.common.error_db).catch(console.error);
                })
        } else {
            message.channel.send(translation.commands.common.error_no_admin).catch(console.error)
        }
    }
}

module.exports = [ createChannelNameCounter, enableTopicCounter, disableTopicCounter, setTopic, removeTopic, setDigit, update, seeSettings, resetSettings ];

//I took this from https://jsperf.com/string-split-by-length/9
String.prototype.splitSlice = function (len) {
    let ret = [];
    for (let offset = 0, strLen = this.length; offset < strLen; offset += len) {
      ret.push(this.slice(offset, len + offset));
    }
    return ret;
}