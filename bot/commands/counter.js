const prefix = process.env.DISCORD_PREFIX;
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const GuildModel = require("../../mongooseModels/GuildModel");
const updateCounter = require("../utils/updateCounter");

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

const createChannelNameCounter = {
    name: "createChannelNameCounter",
    commands: [prefix+"createChannelNameCounter"],
    allowedTypes: ["text"],
    indexZero: true, 
    enabled: true,
    run: (client, message, translation) => {
        //todo
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
            if (args.length === 3) {
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
                    console.log(e);
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
                    console.log(e);
                    message.channel.send(translation.common.error_db).catch(console.error);
                })
        
        } else {
            message.channel.send(translation.commands.common.error_no_admin).catch(console.error)
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
                let messageToSend = "";
                
                message.channel.send(messageToSend).catch(console.error);
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
                    //leave empty all channel topics 
                    if (guild_settings) {
                        guild_settings.enabled_channels.forEach(channel_id => {
                            if (client.channels.has(channel_id)) client.channels.get(channel_id).setTopic('').catch(console.error)
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

module.exports = [ enableTopicCounter, disableTopicCounter, createChannelNameCounter, setDigit, setTopic, removeTopic, update, seeSettings, resetSettings ];