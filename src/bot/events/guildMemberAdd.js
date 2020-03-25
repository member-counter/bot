const updateCounter = require("../utils/updateCounter");
const fetchGuildSettings = require('../utils/fetchGuildSettings');

const PREMIUM_BOT = JSON.parse(process.env.PREMIUM_BOT);
const { PREMIUM_BOT_ID } = process.env;

module.exports = (client, guild, member) => {

    // Apply new permissions for the premium bot when it joins
    if (!PREMIUM_BOT && member.id === PREMIUM_BOT_ID) {
        fetchGuildSettings(guild.id)
            .then(async (guildSettings) => {
                if (guildSettings.premium) {
                    console.log(`Premium Bot joined in a premium guild, ${guild.name} (${guild.id}), applyign permissions for the enabled channels`);
                    const { channelNameCounters } = guildSettings;

                    let successEdits = 0;

                    for (const [channelId] of channelNameCounters) {
                        const channel = guild.channels.get(channelId);

                        await channel
                            .editPermission(
                                PREMIUM_BOT_ID,
                                0x00100000 | 0x00000400,
                                0,
                                "member"
                            )
                            .then(() => successEdits++)
                            .catch(console.error);
                    }

                    console.log(`Edited ${successEdits} of ${channelNameCounters.size} channels successfully in the guild ${guild.name} (${guild.id})`);

                    guild.leave().catch(console.error);
                }
            })
            .catch(console.error);
    }

    updateCounter({client, guildSettings: guild.id});
};