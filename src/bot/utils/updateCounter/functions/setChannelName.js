const removeChannelFromDB = require("./removeChannelFromDB");
const botHasPermsToEditChannel = require("./botHasPermsToEditChannel");

module.exports = async ({ client, guildSettings, channelId, channelName, count }) => {
    const { guild_id } = guildSettings;
    const guild = client.guilds.get(guild_id);

    if (guild && guild.channels.has(channelId)) {
        const channel = client.guilds.get(guild_id).channels.get(channelId);

        if(!botHasPermsToEditChannel(client, channel)) return;

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