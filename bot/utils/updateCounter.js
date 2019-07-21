const GuildModel = require('../../mongooseModels/GuildModel');
const { log, error } = require('../utils/customConsole');
const default_lang = process.env.DEFAULT_LANG;
const { getAvailableLanguages } = require('../utils/language');
module.exports = (client, guild_id) => {
    GuildModel.findOne({guild_id})
    .then((guild_config)=>{
        if (guild_config && (guild_config.channel_id.length !== 0)) {
            const memberCount = client.guilds.get(guild_id).memberCount.toString().split('');
            let memberCountCustomized = "";

            memberCount.forEach(digit => {
                memberCountCustomized += guild_config.custom_numbers[digit]
            });

            guild_config.channel_id.forEach(channel => {
                if (client.channels.get(channel)) {
                    client.channels.get(channel).setTopic(guild_config.topic.replace('{COUNT}', memberCountCustomized))
                    .catch( async (e)=>{
                        error(e);
                        const { error_no_perms } = require(`../lang/${((await getAvailableLanguages()).includes(guild_config.lang)) ? guild_config.lang : default_lang }.json`).functions.updateCounter;
                        if(e.code && (e.code === 50013)) client.channels.get(channel).send(error_no_perms).catch(error);
                    });
                }
            });
        }
    })
    .catch(error)
}
