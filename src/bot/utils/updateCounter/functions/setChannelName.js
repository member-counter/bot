const removeChannelFromDB = require("./removeChannelFromDB");

module.exports = ({ client, guildSettings, channelId, channelName, count }) => {
    const { guild_id } = guildSettings;

    if (client.guilds.get(guild_id).channels.has(channelId)) {
        const channel = client.guilds.get(guild_id).channels.get(channelId);

        const nameToSet = channelName.replace(/\{COUNT\}/gi, count);
       
        channel
            .edit({
                name: nameToSet
            })
            .catch((error) => {
                removeChannelFromDB({
                    client,
                    guildSettings,
                    error,
                    channelId,
                    type: "channelNameCounter"
                });
                console.error(error);
            });
    } else {
        removeChannelFromDB({
            client,
            guildSettings,
            channelId,
            type: "channelNameCounter",
            forceRemove: true
        });
    }
};