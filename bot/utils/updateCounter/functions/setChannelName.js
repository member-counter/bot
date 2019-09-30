const removeChannelFromDb = require("./removeChannelFromDb");

module.exports = ({ client, guildSettings, channelId, channelName, count }) => {
    if (client.channels.has(channelId)) {
        const nameToSet = channelName.replace(/\{COUNT\}/gi, count);
        client.channels
            .get(channelId)
            .setName(nameToSet)
            .catch((error) => {
                removeChannelFromDb({
                    client,
                    guildSettings,
                    error,
                    channelId,
                    type: "channelNameCounter"
                });
                console.error(error);
            });
    }
};
