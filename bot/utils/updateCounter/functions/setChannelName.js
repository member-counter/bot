module.exports = ({ client, channelId, channelName, count }) => {
    if (client.channels.has(channelId)) {
        const nameToSet = channelName.replace(/\{COUNT\}/gi, count);
        client.channels
            .get(channelId)
            .setName(nameToSet)
            .catch(console.error);
    }
};
