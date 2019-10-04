const owners = process.env.BOT_OWNERS.split(/,\s?/);
const updateCounter = require("../utils/updateCounter");
const UserModel = require("../../mongooseModels/UserModel");

const newChannelNameCounter = {
    name: "newChannelNameCounter",
    variants: ["{PREFIX}newChannelNameCounter", "{PREFIX}createChannelNameCounter"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: ({ message, guild_settings, translation }) => {
        const { client, guild, channel, content, member  } = message;
        if (member.hasPermission("ADMINISTRATOR") || owners.includes(member.id)) {
            const args = content.split(/\s+/);
            const type = args[1];
            //used to set a channel name if there is not specified a one
            const availableCounterTypesString = translation.functions.counter_types;
            //used for comparation and configuration
            const availableCounterTypes = availableCounterTypesString.map(str => str.replace(/\s+/g, "").toLowerCase());

            //check if the user added the first arg and check if it's valid
            if (type && availableCounterTypes.includes(type.toLowerCase())) {
                let channelName;

                //extract custom channel name, if you know a better way to do this, please, do a PR
                channelName = [];
                content.split(" ").forEach((part, i) => {
                    if (i !== 0 && part !== "" ) channelName.push(part);
                });

                //remove the type argument from the custom channel name
                channelName = channelName.slice(1);

                let indexOfTypeInTheList = availableCounterTypes.findIndex(item => item === type.toLowerCase());
                channelName = channelName.length === 0 ? `{COUNT} ${availableCounterTypesString[indexOfTypeInTheList]}` : channelName.join(" ");
    
                guild
                    .createChannel(
                        channelName.replace(/\{COUNT\}/gi, ""),
                        {
                            type: "voice",
                            permissionOverwrites: [
                                {
                                    id: guild.id,
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
                        guild_settings.channelNameCounter.set(voiceChannel.id, channelName);
                        guild_settings.channelNameCounter_types.set(voiceChannel.id, type.toLowerCase());
                        guild_settings.save()
                            .then(() => {
                                updateCounter(client, guild_settings);
                                channel.send(translation.commands.newChannelNameCounter.success).catch(console.error);
                            })
                            .catch(error => {
                                console.error(error);
                                channel.send(translation.common.error_unknown).catch(console.error);
                            });
                    })
                    .catch(e => {
                        console.error(e);
                        if (e.code === 50013)
                            channel.send(translation.commands.newChannelNameCounter.no_perms).catch(console.error);
                        else channel.send(translation.common.error_unknown).catch(console.error);
                    });
            } else {
                channel.send(translation.commands.newChannelNameCounter.error_invalid_params.replace("{PREFIX}", guild_settings.prefix));
            }
        }
    }
};

const topicCounter = {
    name: "topicCounter",
    variants: ["{PREFIX}topicCounter"],
    allowedTypes: ["text"],
    indexZero: true, 
    enabled: true,
    run: ({ message, guild_settings, translation }) => {
        const { client, guild, channel, content, member, mentions  } = message;
        if (member.hasPermission('ADMINISTRATOR') || owners.includes(member.id)) {
            const args = content.split(/\s+/);
            const action = args[1] ? args[1].toLowerCase() : "";
            
            //analyze in which channels the user wants to enable or disable the topic counter
            let channelsToPerformAction = [];
            if (content.toLowerCase().includes("all")) {
                channelsToPerformAction = guild.channels.filter(channel => channel.type === "text" || channel.type === "news").keyArray();
            } else if (mentions.channels.size > 0) {
                channelsToPerformAction = mentions.channels.keyArray();
            } else {
                channelsToPerformAction = [channel.id]
            }


            switch (action) {
                case "enable":
                    channelsToPerformAction.forEach(channel_id => {
                        if (!guild_settings.enabled_channels.includes(channel_id)) guild_settings.enabled_channels.push(channel_id);
                    });

                    guild_settings.save()
                        .then(() => {
                            updateCounter(client, guild_settings);

                            //prepare success message
                            let channelsToMention = "";
                            channelsToPerformAction.forEach((channel, i) => {
                                channelsToMention += `${(i === 0) ? "" : " "}<#${channel}>${(i === channelsToPerformAction.length-1) ? '.' : ','}`; 
                            });
                            const { success_enable } = translation.commands.topicCounter;
                            channel.send(success_enable.replace("{CHANNELS}", channelsToMention)).catch(console.error);
                        })
                        .catch(error => {
                            console.error(error);
                            channel.send(translation.common.error_db).catch(console.error);
                        });
                    break;
            
                case "disable":
                    guild_settings.enabled_channels = guild_settings.enabled_channels.filter(x => channelsToPerformAction.indexOf(x) === -1);
                    guild_settings.save()
                        .then(() => {
                            //leave the topic empty
                            channelsToPerformAction.forEach(channel_id => {
                                if (client.channels.has(channel_id)) client.channels.get(channel_id).setTopic('').catch(console.error);
                            });
                            
                            //prepare success message
                            let channelsToMention = "";
                            channelsToPerformAction.forEach((channel, i) => {
                                channelsToMention += `${(i === 0) ? "" : " "}<#${channel}>${(i === channelsToPerformAction.length-1) ? '.' : ','}`; 
                            });
                            const { success_disable } = translation.commands.topicCounter;
                            channel.send(success_disable.replace("{CHANNELS}", channelsToMention)).catch(console.error);
                        })
                        .catch(error => {
                            console.error(error);
                            channel.send(translation.common.error_db).catch(console.error);
                        });
                    break;

                default:
                    channel.send(translation.commands.topicCounter.error_invalid_params.replace("{PREFIX}", guild_settings.prefix)).catch(console.error)
                    break;
            }
        } else {
            channel.send(translation.common.error_no_admin).catch(console.error)
        }
    }
}

const setTopic = {
    name: "setTopic",
    variants: ["{PREFIX}setTopic"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: ({ message, guild_settings, translation }) => {
        const { client, channel, content, member, author  } = message;
        if (member.hasPermission('ADMINISTRATOR') || owners.includes(member.id)) {
            //remove
            UserModel.findOneAndUpdate({ user_id: author.id }, {}, { new: true, upsert: true })
            .then(UserData => {
                if (!(!UserData.voted_dbl && /<a?:.+:[0-9]+>/g.test(content))) {
            //remove end
                    const args = content.split(" ");
                    let channelsToCustomize = [];
                    let newTopic = "";

                    //check if the topic must be setted for specific channels. No, I can't use mentions.channels because that could also include mentioned channels inside newTopic
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
                                updateCounter(client, guild_settings);
                                let msgChannels = "";
                                channelsToCustomize.forEach((channel, i) => {
                                    msgChannels += `${(i === 0) ? "" : " "}<#${channel}>${(i === channelsToCustomize.length-1) ? '.' : ','}`; 
                                });
                                channel.send(translation.commands.setTopic.success_unique.replace("{CHANNELS}", msgChannels)).catch(console.error);
                            })
                            .catch((e) => {
                                console.error(e);
                                channel.send(translation.common.error_db).catch(console.error);
                            })
                    } else if (sliceFrom === undefined) {
                        //this happens when you run the command with mentioned channels but without a topic, like "prefix!setTopic #general"
                        channel.send(translation.commands.setTopic.no_topic.replace("{PREFIX}", guild_settings.prefix)).catch(console.error);
                    } else {
                        guild_settings.topic = newTopic;
                        guild_settings.save()
                            .then(() => {
                                updateCounter(client, guild_settings);
                                channel.send(translation.commands.setTopic.success).catch(console.error);
                            })
                            .catch((e) => {
                                console.error(e);
                                channel.send(translation.common.error_db).catch(console.error);
                            })
                    }
            //remove
                } else {
                    channel.send(translation.commands.setTopic.error_no_dbl_vote).catch(console.error);
                }
            })
            .catch((e) => {
                console.error(e);
                channel.send(translation.common.error_db).catch(console.error);
            });
            //remove end
        } else {
            channel.send(translation.common.error_no_admin).catch(console.error)
        }
    }
}

const removeTopic = {
    name: "removeTopic",
    variants: ["{PREFIX}removeTopic"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: ({ message, guild_settings, translation }) => {
        const { client, channel, member, mentions  } = message;
        if (member.hasPermission('ADMINISTRATOR') || owners.includes(member.id)) {
            const mentionedChannels = mentions.channels.keyArray();
            if (mentionedChannels.length > 0) {
                mentionedChannels.forEach(channel_id => {
                    guild_settings.unique_topics.delete(channel_id);
                });
                guild_settings.save()
                    .then(() => {
                        updateCounter(client, guild_settings);
                        let stringMentionedChannels = "";
                        mentionedChannels.forEach((channel, i) => {
                            stringMentionedChannels += `${(i === 0) ? "" : " "}<#${channel}>${(i === mentionedChannels.length-1) ? '.' : ','}`;
                        });
                        channel.send(translation.commands.removeTopic.success_unique.replace("{CHANNELS}", stringMentionedChannels)).catch(console.error);
                    })
                    .catch((e) => {
                        console.error(e);
                        channel.send(translation.common.error_db).catch(console.error);
                    })
            } else {
                guild_settings.topic = "Members: {COUNT}";
                guild_settings.save()
                    .then(() => {
                        updateCounter(client, guild_settings);
                        channel.send(translation.commands.removeTopic.success).catch(console.error);
                    })
                    .catch((e) => {
                        console.error(e);
                        channel.send(translation.common.error_db).catch(console.error);
                    })
            }
        } else {
            channel.send(translation.common.error_no_admin).catch(console.error)
        }
    }
}

const setDigit = {
    name: "setDigit",
    variants: ["{PREFIX}setDigit"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: ({ message, guild_settings, translation }) => {
        const { client, channel, content, member, author  } = message;
        if (member.hasPermission('ADMINISTRATOR') || owners.includes(member.id)) {
        //remove
        UserModel.findOneAndUpdate({ user_id: author.id }, {}, { new: true, upsert: true })
            .then(UserData => {
                if (!(!UserData.voted_dbl && /<a?:.+:[0-9]+>/g.test(content))) {

        //remove end
                    const args = content.split(/\s+/);
                    if (args.length >= 3) {    
                        const digitToUpdate = args[1].slice(0, 1);
                        const newDigitValue = args[2];
    
                        guild_settings.custom_numbers[digitToUpdate] = newDigitValue
                        guild_settings.save()
                            .then(() => {
                                channel.send(translation.commands.setDigit.success).catch(console.error);
                                updateCounter(client, guild_settings);
                            })
                            .catch((e) => {
                                console.error(e);
                                channel.send(translation.common.error_db).catch(console.error);
                            });
                    } else {
                        channel.send(translation.commands.setDigit.error_missing_params.replace("{PREFIX}", guild_settings.prefix)).catch(console.error)
                    }
            //remove
                } else {
                    channel.send(translation.commands.setDigit.error_no_dbl_vote).catch(console.error);
                }
            })
            .catch((e) => {
                console.error(e);
                channel.send(translation.common.error_db).catch(console.error);
            });
            //remove end
        } else {
            channel.send(translation.common.error_no_admin).catch(console.error)
        }
    }
}

const update = {
    name: "update",
    variants: ["{PREFIX}update"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: true,
    run: ({ message, guild_settings, translation }) => {
        const { client, channel, member  } = message;
        if (member.hasPermission('ADMINISTRATOR') || owners.includes(member.id)) {
            updateCounter(client, guild_settings, ["all"]);
            channel.send(translation.commands.update.success).catch(console.error);
        } else {
            channel.send(translation.common.error_no_admin).catch(console.error);
        }
    }
}

module.exports = { newChannelNameCounter, topicCounter, setTopic, removeTopic, setDigit, update };
