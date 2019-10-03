const GuildModel = require("../../mongooseModels/GuildModel");

const regionRelation = {
    brazil: "pt_BR"
};

module.exports = client => {
    client.on("guildCreate", guild => {
        console.log(
            `[Bot shard #${client.shard.id}] Joined guild ${guild.name} (${guild.id}), shard guilds-users: ${client.guilds.size}-${client.users.size}`
        );

        //set language for the guild based on its voice region
        if (regionRelation[guild.region]) {
            GuildModel.findOneAndUpdate(
                { guild_id: guild.id },
                { lang: regionRelation[guild.region] },
                { new: true, upsert: true }
            )
                .exec()
                .catch(console.error);
        }
    });
};
