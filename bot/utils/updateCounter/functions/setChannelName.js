const removeChannelFromDB = require("./removeChannelFromDB");

module.exports = ({ client, guildSettings, channelId, channelName, count }) => {
    if (client.channels.has(channelId)) {
        const nameToSet = channelName.replace(/\{COUNT\}/gi, count);
        client.channels
            .get(channelId)
            .setName(nameToSet)
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
            error,
            channelId,
            type: "channelNameCounter",
            forceRemove: true
        });
    }
};
