const updateCounter = require("../utils/updateCounter");

const newChannelNameCounter = {
    name: "newChannelNameCounter",
    variants: ["newChannelNameCounter", "createChannelNameCounter", "newCategoryNameCounter", "createCategoryNameCounter"],
    allowedTypes: ["text"],
    requiresAdmin: true,
    run: ({ message, guildSettings, languagePack }) => {
        const { client, guild, channel, content } = message;
        const args = content.split(/\s+/);
        const type = args[1];
        const channelType = (args[0].toLowerCase() === "{prefix}newcategorynamecounter".replace("{prefix}", guildSettings.prefix) || args[0].toLowerCase() === "{prefix}createcategorynamecounter".replace("{prefix}", guildSettings.prefix)) ? "category" : "voice";

        //used to set a channel name if there is not specified a one
        const availableCounterTypesString = languagePack.functions.counter_types;
        //used for comparation and configuration
        const availableCounterTypes = ["Members", "Users", "Bots", "Roles", "Channels", "Connected users", "Online members", "Online users", "Online bots", "Offline members", "Offline users", "Offline bots", "Banned members", "memberswithrole"].map(str => str.replace(/\s+/g, "").toLowerCase());

        //check if the user added the first arg and check if it's valid
        if (type && availableCounterTypes.includes(type.toLowerCase())) {
            let channelName;
            let otherConfig = {};

            //extract custom channel name, if you know a better way to do this, please, do a PR
            channelName = [];
            content.split(" ").forEach((part, i) => {
                if (i !== 0 && part !== "" ) channelName.push(part);
            });

            //remove the type argument from the custom channel name
            channelName = channelName.slice(1 + message.mentions.roles.size);


            if (type.toLowerCase() === "memberswithrole") {
                otherConfig.roles = message.mentions.roles.keyArray();
                if (channelName.length === 0) {
                    channelName = "{count} ";
                    message.mentions.roles.forEach(role => channelName += role.name + ", ");
                    //remove last comma
                    channelName = channelName.slice(0, -2);
                } else {
                    channelName = channelName.join(" ");
                }
            } else {
                let indexOfTypeInTheList = availableCounterTypes.findIndex(item => item === type.toLowerCase());
                channelName = channelName.length === 0 ? `{COUNT} ${availableCounterTypesString[indexOfTypeInTheList]}` : channelName.join(" ");
            }

            if (type.toLowerCase() === "bannedmembers" && !guild.members.get(client.user.id).hasPermission("BAN_MEMBERS")) {
                channel.send(languagePack.commands.newChannelNameCounter.no_perms_ban).catch(console.error);
                return;
            }

            guild
                .createChannel(
                    channelName.replace(/\{COUNT\}/gi, "..."),
                    {
                        type: channelType,
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
                    guildSettings.channelNameCounters.set(voiceChannel.id, { channelName, type: type.toLowerCase(), otherConfig});
                    guildSettings.save()
                        .then(() => {
                            updateCounter({client, guildSettings, force: true});
                            channel.send(languagePack.commands.newChannelNameCounter.success).catch(console.error);
                        })
                        .catch(error => {
                            voiceChannel.delete().catch(console.error);
                            console.error(error);
                            channel.send(languagePack.common.error_unknown).catch(console.error);
                        });
                })
                .catch(e => {
                    console.error(e);
                    if (e.code === 50013)
                        channel.send(languagePack.commands.newChannelNameCounter.no_perms).catch(console.error);
                    else channel.send(languagePack.common.error_unknown).catch(console.error);
                });
        } else {
            channel.send(languagePack.commands.newChannelNameCounter.error_invalid_params.replace(/\{PREFIX\}/gi, guildSettings.prefix));
        }
    }
};

const topicCounter = {
    name: "topicCounter",
    variants: ["topicCounter"],
    allowedTypes: ["text"],
    requiresAdmin: true,
    run: ({ message, guildSettings, languagePack }) => {
        const { client, guild, channel, content, mentions  } = message;
        const args = content.split(/\s+/);
        const action = args[1] ? args[1].toLowerCase() : "";
        
        //analyze in which channels the user wants to enable or disable the topic counter
        let channelsToPerformAction = [];
        if (content.toLowerCase().includes("all")) {
            channelsToPerformAction = guild.channels.filter(channel => channel.type === "text" || channel.type === "news").keyArray();
        } else if (mentions.channels.size > 0) {
            channelsToPerformAction = mentions.channels.keyArray();
        } else {
            channelsToPerformAction = [channel.id];
        }


        switch (action) {
            case "enable":
                channelsToPerformAction.forEach(channel_id => {
                    if (!guildSettings.topicCounterChannels.has(channel_id)) {
                        guildSettings.topicCounterChannels.set(channel_id, {});
                    }
                });

                guildSettings.save()
                    .then(() => {
                        updateCounter({client, guildSettings, force: true});

                        //prepare success message
                        let channelsToMention = "";
                        channelsToPerformAction.forEach((channel, i) => {
                            channelsToMention += `${(i === 0) ? "" : " "}<#${channel}>${(i === channelsToPerformAction.length-1) ? '.' : ','}`; 
                        });
                        const { success_enable } = languagePack.commands.topicCounter;
                        channel.send(success_enable.replace("{CHANNELS}", channelsToMention)).catch(console.error);
                    })
                    .catch(error => {
                        console.error(error);
                        channel.send(languagePack.common.error_db).catch(console.error);
                    });
                break;
        
            case "disable":
                channelsToPerformAction.forEach(channel_id => {
                    if (guildSettings.topicCounterChannels.has(channel_id)) {
                        guildSettings.topicCounterChannels.delete(channel_id);
                        //leave the topic empty
                        channelsToPerformAction.forEach(channel_id => {
                            if (client.channels.has(channel_id)) client.channels.get(channel_id).setTopic('').catch(console.error);
                        });
                    }
                });

                guildSettings.save()
                    .then(() => {
                        
                        //prepare success message
                        let channelsToMention = "";
                        channelsToPerformAction.forEach((channel, i) => {
                            channelsToMention += `${(i === 0) ? "" : " "}<#${channel}>${(i === channelsToPerformAction.length-1) ? '.' : ','}`; 
                        });
                        const { success_disable } = languagePack.commands.topicCounter;
                        channel.send(success_disable.replace("{CHANNELS}", channelsToMention)).catch(console.error);
                    })
                    .catch(error => {
                        console.error(error);
                        channel.send(languagePack.common.error_db).catch(console.error);
                    });
                break;

            default:
                channel.send(languagePack.commands.topicCounter.error_invalid_params.replace(/\{PREFIX\}/gi, guildSettings.prefix)).catch(console.error);
                break;
        }
    }
};

const setTopic = {
    name: "setTopic",
    variants: ["setTopic"],
    allowedTypes: ["text"],
    requiresAdmin: true,
    run: ({ message, guildSettings, languagePack }) => {
        const { client, channel, content } = message;
        if (guildSettings.topicCounterChannels.size > 0) {
            const args = content.split(" ");
            let channelsToCustomize = [];
            let newTopic = "";
    
            //check if the topic must be setted for specific channels. No, I can't use mentions.channels because that could also include mentioned channels that the user pretends to include as decoration
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
                channelsToCustomize.forEach(channel_id => {
                    if (guildSettings.topicCounterChannels.has(channel_id)) {
                        guildSettings.topicCounterChannels.set(channel_id, {
                            ...guildSettings.topicCounterChannels.get(channel_id),
                            topic: newTopic
                        });
                    }
                });
    
                guildSettings.save()
                    .then(() => {
                        updateCounter({client, guildSettings, force: true});
                        let msgChannels = "";
                        channelsToCustomize.forEach((channel, i) => {
                            msgChannels += `${(i === 0) ? "" : " "}<#${channel}>${(i === channelsToCustomize.length-1) ? '.' : ','}`; 
                        });
                        channel.send(languagePack.commands.setTopic.success_unique.replace("{CHANNELS}", msgChannels)).catch(console.error);
                    })
                    .catch((e) => {
                        console.error(e);
                        channel.send(languagePack.common.error_db).catch(console.error);
                    });
            } else if (sliceFrom === undefined) {
                //this happens when you run the command with mentioned channels but without a topic, like "prefix!setTopic #general"
                channel.send(languagePack.commands.setTopic.no_topic.replace(/\{PREFIX\}/gi, guildSettings.prefix)).catch(console.error);
            } else {
                guildSettings.mainTopicCounter = newTopic;
                guildSettings.save()
                    .then(() => {
                        updateCounter({client, guildSettings, force: true});
                        channel.send(languagePack.commands.setTopic.success).catch(console.error);
                    })
                    .catch((e) => {
                        console.error(e);
                        channel.send(languagePack.common.error_db).catch(console.error);
                    });
            }
        } else {
            channel.send(languagePack.common.no_topic_counter_enabled.replace(/\{PREFIX\}/gi, guildSettings.prefix)).catch(console.error);
        }
    }
};

const removeTopic = {
    name: "removeTopic",
    variants: ["removeTopic"],
    allowedTypes: ["text"],
    requiresAdmin: true,
    run: ({ message, guildSettings, languagePack }) => {
        const { client, channel, mentions  } = message;
        if (guildSettings.topicCounterChannels.size > 0) {
            const mentionedChannels = mentions.channels.keyArray();
            if (mentionedChannels.length > 0) {
                mentionedChannels.forEach(channel_id => {
                    if (guildSettings.topicCounterChannels.has(channel_id)) {
                        guildSettings.topicCounterChannels.set(channel_id, {
                            ...guildSettings.topicCounterChannels.get(channel_id),
                            topic: undefined
                        });
                    }
                });
                guildSettings.save()
                    .then(() => {
                        updateCounter({client, guildSettings, force: true});
                        let stringMentionedChannels = "";
                        mentionedChannels.forEach((channel, i) => {
                            stringMentionedChannels += `${(i === 0) ? "" : " "}<#${channel}>${(i === mentionedChannels.length-1) ? '.' : ','}`;
                        });
                        channel.send(languagePack.commands.removeTopic.success_unique.replace("{CHANNELS}", stringMentionedChannels)).catch(console.error);
                    })
                    .catch((e) => {
                        console.error(e);
                        channel.send(languagePack.common.error_db).catch(console.error);
                    });
            } else {
                guildSettings.mainTopicCounter = "Members: {COUNT}";
                guildSettings.save()
                    .then(() => {
                        updateCounter({client, guildSettings, force: true});
                        channel.send(languagePack.commands.removeTopic.success).catch(console.error);
                    })
                    .catch((e) => {
                        console.error(e);
                        channel.send(languagePack.common.error_db).catch(console.error);
                    });
            }
        } else {
            channel.send(languagePack.common.no_topic_counter_enabled.replace(/\{PREFIX\}/gi, guildSettings.prefix)).catch(console.error);
        }
    }
};

const setDigit = {
    name: "setDigit",
    variants: ["setDigit"],
    allowedTypes: ["text"],
    requiresAdmin: true,
    run: ({ message, guildSettings, languagePack }) => {
        const { client, channel, content } = message;
        const args = content.split(/\s+/);
        if (args[1] === "reset") {
            guildSettings.topicCounterCustomNumbers = {};
            guildSettings.save()
                    .then(() => {
                        channel.send(languagePack.commands.setDigit.reset_success).catch(console.error);
                        updateCounter({client, guildSettings, force: true});
                    })
                    .catch((e) => {
                        console.error(e);
                        channel.send(languagePack.common.error_db).catch(console.error);
                    });
        } else {
            if (args.length >= 3) {    
                const digitToUpdate = args[1].slice(0, 1);
                const newDigitValue = args[2];

                guildSettings.topicCounterCustomNumbers[digitToUpdate] = newDigitValue;
                guildSettings.save()
                    .then(() => {
                        channel.send(languagePack.commands.setDigit.success).catch(console.error);
                        updateCounter({client, guildSettings, force: true});
                    })
                    .catch((e) => {
                        console.error(e);
                        channel.send(languagePack.common.error_db).catch(console.error);
                    });
            } else {
                channel.send(languagePack.commands.setDigit.error_missing_params.replace(/\{PREFIX\}/gi, guildSettings.prefix)).catch(console.error);
            }
        }
    }
};

const update = {
    name: "update",
    variants: ["update", "updateCounter"],
    allowedTypes: ["text"],
    requiresAdmin: true,
    run: ({ message, guildSettings, languagePack }) => {
        const { client, channel  } = message;
        updateCounter({client, guildSettings, force: true});
        channel.send(languagePack.commands.update.success).catch(console.error);
    }
};

module.exports = { newChannelNameCounter, topicCounter, setTopic, removeTopic, setDigit, update };
