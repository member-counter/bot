const removeChannelFromDB = require("./removeChannelFromDB");

module.exports = async ({ client, guildSettings, channelId, channelName, count }) => {
    const { guild_id } = guildSettings;

    if (client.guilds.get(guild_id).channels.has(channelId)) {
        const channel = client.guilds.get(guild_id).channels.get(channelId);

        let nameToSet = channelName.replace(/\{COUNT\}/gi, count).slice(0, 99);

        // check if it's necessary to edit the channel
        if (channel.name !== nameToSet) {
            if (nameToSet.length < 2) nameToSet = "Invalid length!";
    
            await channel
                .edit({ name: nameToSet })
                .catch((error) => {
                    console.error(error);
                    removeChannelFromDB({ client, guildSettings, error, channelId, type: "channelNameCounter" });
                });
        }
    }
};