const updateCounter = require("../utils/updateCounter");
const fetchGuildSettings = require("../utils/fetchGuildSettings");

module.exports = (client, channel) => {
    const { guild, name, topic } = channel;
    console.log(name)
    if (guild) {
        fetchGuildSettings(guild.id)
            .then(guildSettings => {
                const { channelNameCounters } = guildSettings;
                const channelNameCounterToUpdate = channelNameCounters.get(channel.id);

                if (channelNameCounterToUpdate && /\{count\}/gi.test(name)) {
                    channelNameCounters.set(channel.id, {
                        ...channelNameCounterToUpdate,
                        channelName: name
                    })
                }

                guildSettings.save()
                    .then(() => updateCounter({ client, guildSettings }))
                    .catch(console.error)
            })
            .catch(console.error);
    }
}