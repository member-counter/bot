const GuildModel = require('../../mongooseModels/GuildModel');
const { log, error } = require('../utils/customConsole');

module.exports = (client, guild_id) => {
    GuildModel.findOne({guild_id})
    .then((guild_config)=>{
        if (guild_config.channel_id !== '0') {
            const memberCount = client.guilds.get(guild_id).memberCount.toString().split('');
            let memberCountCustomized = new String();

            memberCount.forEach(digit => {
                memberCountCustomized += guild_config.custom_numbers[digit]
            });

            client.channels.get(guild_config.channel_id).setTopic(guild_config.topic.replace('{COUNT}', memberCountCustomized))
            .catch((e)=>{
                error(e);
                if(e.code && (e.code === 50013)) client.channels.get(guild_config.channel_id).send('Looks like I don\'t have permissions to set the topic of this channel. Please, give me the proper permissions.').catch(error);
            });
        }
    })
    .catch(error)
}
