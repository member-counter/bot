const GuildModel = require("../../mongooseModels/GuildModel");
const UserModel = require("../../mongooseModels/UserModel");
const getLanguages = require("../utils/getLanguages");

const seeSettings = {
    name: "seeSettings",
    variants: ["seeSettings"],
    allowedTypes: ["text"],
    requiresAdmin: false,
    run: ({ message, guildSettings, languagePack }) => {
        const { guild, channel } = message;
        const {
            lang_text,
            prefix_text,
            premium_text,
            premium_no_tier_text,
            premium_low_tier_text,
            premium_high_tier_text,
            allowed_roles_text,
            header_text,
            enabled_channel_name_counters_text,
            misc_type,
            enabled_channel_topic_counters_text,
            main_topic_text,
            custom_numbers_text
        } = languagePack.commands.seeSettings.settings_message;
        const {
            prefix,
            premium_status,
            lang,
            allowedRoles,
            channelNameCounters,
            topicCounterChannels,
            mainTopicCounter,
            topicCounterCustomNumbers,
        } = guildSettings;

        let messageToSend = "";
        
        messageToSend += `${header_text} ${guild.name} \`(${guild.id})\`\n\n`;
        
        //Premium
        let guildPremiumTier = premium_no_tier_text;
        if (premium_status === 1) guildPremiumTier = premium_low_tier_text;
        if (premium_status === 2) guildPremiumTier = premium_high_tier_text;

        messageToSend += `${premium_text} ${guildPremiumTier}\n`;

        //prefix and language

        messageToSend += `${prefix_text} ${prefix}\n`;
        messageToSend += `${lang_text} \`${lang}\` \\➡ ${languagePack.lang_name}\n\n`;

        //Allowed roles for administrative commands
        if (allowedRoles.length > 0) {
            let allowed_roles = "";
            allowedRoles.forEach((role_id) => {
                if (guild.roles.has(role_id)) allowed_roles += " <@&" + role_id + ">";
            });
            messageToSend += `${allowed_roles_text} ${allowed_roles}\n`;
        }

        //channel name counters:
        if (channelNameCounters.size > 0) {
            messageToSend += `${enabled_channel_name_counters_text}\n`;

            channelNameCounters.forEach((channelNameCounter, channelId) => {
                messageToSend += `\\• <#${channelId}> \`(${channelId})\` \\➡ ${misc_type} \`${channelNameCounter.type}\``;    
                if (channelNameCounter.type === "memberswithrole") {
                    messageToSend += " \\➡ ";
                    channelNameCounter.otherConfig.roles.forEach(roleId => {
                        messageToSend += " <@&" + roleId + ">"
                    });
                }
                messageToSend += "\n";
            });
            
            messageToSend += "\n";
        }

        //channel topic counters:
        if (topicCounterChannels.size > 0) {
            messageToSend += `${enabled_channel_topic_counters_text}\n`;

            topicCounterChannels.forEach((topicCounterChannel, channelId) => {
                messageToSend +=`\\• <#${channelId}> \`(${channelId})\` ${(topicCounterChannel.topic) ? `\\➡ ${topicCounterChannel.topic}` : ""}\n`;
            });

            messageToSend += "\n";
        }

        //Main topic for topic counters
        messageToSend += `${main_topic_text} \`\`\`${mainTopicCounter}\`\`\``;

        //numbers
        messageToSend += `\n${custom_numbers_text}\n`;

        Object.entries(topicCounterCustomNumbers.toObject()).forEach((number, i) => {
            messageToSend +=`${i} \\➡ ${number[1]}\n`;
        });

        //send in various messages
        messageToSend.splitSlice(2000).forEach(part => {
            channel.send(part).catch(console.error);
        });
    }
};

const resetSettings = {
    name: "resetSettings",
    variants: ["resetSettings", "restoreSettings"],
    allowedTypes: ["text"],
    requiresAdmin: true,
    run: ({ message, guildSettings, languagePack }) => {
        const { client, guild, channel } = message;
        GuildModel.findOneAndRemove({ guild_id: guild.id })
            .then(() => { 
            //leave empty all channel topics
            guildSettings.topicCounterChannels.forEach((_, channelId) => {
                if (client.channels.has(channelId)) {
                    client.channels.get(channelId).setTopic('').catch(console.error);
                }
            });
            
            //delete all channel name counters
            guildSettings.channelNameCounters.forEach((_, channelId) => {
                if (client.channels.has(channelId)) {
                    client.channels.get(channelId).delete().catch(console.error);
                }
            });

            channel.send(languagePack.commands.resetSettings.done).catch(console.error);
        })
        .catch(error => {
            console.error(error);
            channel.send(languagePack.common.error_db).catch(console.error);
        });
    }
};

const lang = {
    name: "lang",
    variants: ["lang"],
    allowedTypes: ["text"],
    requiresAdmin: true,
    run: async ({ message, guildSettings, languagePack }) => {
        const { content, channel } = message;
        const args = content.split(/\s+/);
        const lang_code = args[1];
        const languages = await getLanguages();
        if (languages.has(lang_code)) {
            guildSettings.lang = lang_code;
            guildSettings
                .save()
                .then(() => {
                    channel.send(languages.get(lang_code).commands.lang.success).catch(console.error);
                })
                .catch(error => {
                    console.error(error);
                    channel.send(languagePack.common.error_db).catch(console.error);
                });
        } else {
            let messageToSend = languagePack.commands.lang.error_not_found + "\n";
            messageToSend += "```fix\n";
            languages.forEach((value, lang_code) => {
                messageToSend += lang_code + " ➡ " + value.lang_name + "\n";
            });
            messageToSend += "```";
            channel.send(messageToSend).catch(console.error);
        }
    }
};

const prefix = {
    name: "prefix",
    variants: ["prefix"],
    allowedTypes: ["text"],
    requiresAdmin: true,
    run: ({ message, guildSettings, languagePack }) => {
        const { channel, content } = message;
        const args = content.split(/\s+/g);
        guildSettings.prefix = args[1] ? args[1] : guildSettings.prefix;
        guildSettings
            .save()
            .then(() => {
                channel.send(languagePack.commands.prefix.success.replace("{NEW_PREFIX}", guildSettings.prefix)).catch(console.error);
            })
            .catch(error => {
                console.error(error);
                channel.send(languagePack.common.error_db).catch(console.error);
            });
    }
};


const role = {
    name: "role",
    variants: ["role", "roles"],
    allowedTypes: ["text"],
    requiresAdmin: true,
    run: ({ message, guildSettings, languagePack }) => {
        const { channel, content, guild } = message;
        const args = content.split(/\s+/);
        const rolesToPerformAction = message.mentions.roles.keyArray();

        const saveConfig = () => {
            if (rolesToPerformAction.length > 0 || /all(\s|$)/g.test(content)) {
                guildSettings.save()
                    .then(() => {
                        channel.send(languagePack.commands.role.roles_updated).catch(console.error);
                    })
                    .catch(error => {
                        console.error(error);
                        channel.send(languagePack.common.error_db).catch(console.error);
                    });
            } else {
                channel.send(languagePack.commands.role.error_no_roles_to_update).catch(console.error);
            }
        };

        switch (args[1]) {
            case "allow":
                if (/all(\s|$)/g.test(content)) {
                    //that filter is to remove @everyone
                    guildSettings.allowedRoles = guild.roles.keyArray().filter(role => role !== guild.id);
                } else {
                    rolesToPerformAction.forEach(role => {
                        if (!guildSettings.allowedRoles.includes(role)) guildSettings.allowedRoles.push(role);
                    });
                }
                saveConfig();
                break;
        
            case "deny":
                if (/all(\s|$)/g.test(content)) {
                    guildSettings.allowedRoles = [];
                } else {
                    guildSettings.allowedRoles = guildSettings.allowedRoles.filter(role => !rolesToPerformAction.includes(role));
                }
                saveConfig();
                break;

            default:
                channel.send(languagePack.commands.role.invalid_params.replace(/\{PREFIX\}/gi, guildSettings.prefix)).catch(console.error);
                break;
        }
    }
};

const upgradeServer = {
    name: "upgradeServer",
    variants: ["upgradeServer", "serverupgrade"],
    allowedTypes: ["text"],
    requiresAdmin: false,
    run: ({ message, guildSettings, languagePack }) => {
        const { author, channel } = message;
        let { high_tier_success, low_tier_success, points_left, error_no_points_left, error_cannot_upgrade } = languagePack.commands.upgradeServer;
        UserModel.findOneAndUpdate({ user_id: author.id }, { }, { new: true, upsert: true})
            .then(userDoc => {
                if (userDoc.premium) {
                    if (guildSettings.premium_status < 2) {
                        guildSettings.premium_status = 2;
                        guildSettings.save()
                            .then(() => {
                                channel.send(high_tier_success).catch(console.error);
                            })
                            .catch(error => {
                                console.error(error);
                                channel.send(languagePack.common.error_db).catch(console.error);
                            });
                    } else {
                        channel.send(error_cannot_upgrade).catch(console.error);
                    }
                } else if (userDoc.available_points > 0) {
                    if (guildSettings.premium_status < 1) {
                        guildSettings.premium_status = 1;
                        guildSettings.save()
                        .then(() => {
                            channel.send(low_tier_success).catch(console.error);

                            UserModel.findOneAndUpdate(
                                { user_id: author.id },
                                { $inc: { available_points: -1 } }, 
                                { new: true, upsert: true }
                            )
                                .then(userDoc => {
                                    channel.send(points_left.replace("{POINTS}", userDoc.available_points)).catch(console.error);
                                })
                                .catch(console.error);
                        })
                        .catch(error => {
                            console.error(error);
                            channel.send(languagePack.common.error_db).catch(console.error);
                        });

                    } else {
                        channel.send(error_cannot_upgrade).catch(console.error);
                    }
                } else {
                    channel.send(error_no_points_left.replace(/\{PREFIX\}/gi, guildSettings.prefix)).catch(console.error);
                }
            })
            .catch(error => {
                console.error(error);
                channel.send(languagePack.common.error_db).catch(console.error);
            });
    }
};

module.exports = { seeSettings, resetSettings, prefix, lang, role, upgradeServer };

//I took this from https://jsperf.com/string-split-by-length/9
String.prototype.splitSlice = function (len) {
    let result = [];
    for (let offset = 0, strLen = this.length; offset < strLen; offset += len) {
        result.push(this.slice(offset, len + offset));
    }
    return result;
};
