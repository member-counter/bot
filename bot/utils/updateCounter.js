const GuildModel = require('../../mongooseModels/GuildModel');
const default_lang = process.env.DISCORD_DEFAULT_LANG;
const { getAvailableLanguages } = require('../utils/language');
module.exports = (client, guild_id) => {
    if (client.guilds.get(guild_id)) {
        console.log(`[Bot shard #${client.shard.id}] Updating ${client.guilds.get(guild_id).name} (${guild_id}) counter, ${client.guilds.get(guild_id).memberCount} members.`)
        GuildModel.findOne({guild_id})
            .then((guild_config) => {
                if (guild_config && (guild_config.enabled_channels.length !== 0)) {
                    const memberCount = client.guilds.get(guild_id).memberCount.toString().split('');
                    let memberCountCustomized = "";

                    memberCount.forEach(digit => {
                        memberCountCustomized += guild_config.custom_numbers[digit]
                    });

                    guild_config.enabled_channels.forEach(channel => {
                        if (client.channels.get(channel)) {
                            client.channels.get(channel).setTopic(guild_config.topic.replace(/\{COUNT\}/gi, memberCountCustomized))
                                .catch( async (e) => {
                                    const { error_no_perms } = require(`../lang/${((await getAvailableLanguages()).includes(guild_config.lang)) ? guild_config.lang : default_lang }.json`).functions.updateCounter;
                                    if (e.code && (e.code === 50013)) client.channels.get(channel).send(error_no_perms).catch(console.error);
                                });
                        }
                    });
                }
            })
            .catch(console.error)
    }
}
