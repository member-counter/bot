const owners = process.env.BOT_OWNERS.split(/,\s?/);
const updateCounter = require("../utils/updateCounter");

const createChannelNameCounter = {
    name: "createChannelNameCounter",
    variants: ["{PREFIX}createChannelNameCounter"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: ({ client, message, guild_settings, translation }) => {
        if (
            message.member.hasPermission("ADMINISTRATOR") ||
            owners.includes(message.member.id)
        ) {
            //extract topic, if you know a better way to do this, please, do a PR
            let name = [];
            message.content.split(" ").forEach((part, i) => {
                if (i !== 0 && part !== "") name.push(part);
            });

            name = name.length === 0 ? "Members: {COUNT}" : name.join(" ");

            message.guild
                .createChannel(
                    name.replace(/\{COUNT\}/gi, message.guild.memberCount),
                    {
                        type: "voice",
                        permissionOverwrites: [
                            {
                                id: message.guild.id,
                                deny: ["CONNECT"]
                            },
                            {
                                id: client.user.id,
                                allow: ["CONNECT"]
                            }
                        ]
                    }
                )
                .then(voiceChannel => {
                    guild_settings.channelNameCounter.set(
                        voiceChannel.id,
                        name
                    );
                    guild_settings
                        .save()
                        .then(() => {
                            message.channel
                                .send(
                                    translation.commands
                                        .createChannelNameCounter.success
                                )
                                .catch(console.error);
                        })
                        .catch(e => {
                            console.error(e);
                            message.channel
                                .send(translation.common.error_unknown)
                                .catch(console.error);
                        });
                })
                .catch(e => {
                    console.error(e);
                    if (e.code === 50013)
                        message.channel
                            .send(
                                translation.commands.createChannelNameCounter
                                    .no_perms
                            )
                            .catch(console.error);
                    else
                        message.channel
                            .send(translation.common.error_unknown)
                            .catch(console.error);
                });
        }
    }
};

const enableTopicCounter = {
    name: "enableTopicCounter",
    variants: ["{PREFIX}enableTopicCounter", "{PREFIX}enable"],
    allowedTypes: ["text"],
    indexZero: true, 
    enabled: true,
    run: ({ client, message, guild_settings, translation }) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
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
        } else {
            message.channel.send(translation.common.error_no_admin).catch(console.error)
        }
    }
}

const disableTopicCounter = {
    name: "disableTopicCounter",
    variants: ["{PREFIX}disableTopicCounter", "{PREFIX}disable"],
    allowedTypes: ["text"],
    indexZero: true, 
    enabled: true,
    run: ({ client, message, guild_settings, translation }) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
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
        } else {
            message.channel.send(translation.common.error_no_admin).catch(console.error)
        }
    }
}

const setTopic = {
    name: "setTopic",
    variants: ["{PREFIX}setTopic"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: ({ client, message, guild_settings, translation }) => {
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
                message.channel.send(translation.commands.setTopic.no_topic.replace("{PREFIX}", guild_settings.prefix)).catch(console.error);
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
        } else {
            message.channel.send(translation.common.error_no_admin).catch(console.error)
        }
    }
}

const removeTopic = {
    name: "removeTopic",
    variants: ["{PREFIX}removeTopic"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: (client, message, guild_settings, translation) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
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
        } else {
            message.channel.send(translation.common.error_no_admin).catch(console.error)
        }
    }
}

const setDigit = {
    name: "setDigit",
    variants: ["{PREFIX}setDigit"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: (client, message, guild_settings, translation) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            const args = message.content.split(/\s+/);
            if (args.length >= 3) {    
                const digitToUpdate = args[1].slice(0, 1);
                const newDigitValue = args[2];

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
            } else {
                message.channel.send(translation.commands.setDigit.error_missing_params.replace("{PREFIX}", guild_settings.prefix)).catch(console.error)
            }
        } else {
            message.channel.send(translation.common.error_no_admin).catch(console.error)
        }
    }
}

const update = {
    name: "update",
    variants: ["{PREFIX}update"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: (client, message, guild_settings, translation) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            updateCounter(client, message.guild.id);
            message.channel.send(translation.commands.update.success).catch(console.error);
        } else {
            message.channel.send(translation.common.error_no_admin).catch(console.error);
        }
    }
}

module.exports = { createChannelNameCounter, enableTopicCounter, disableTopicCounter, setTopic, removeTopic, setDigit, update };
