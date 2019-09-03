const info = {
    name: "info",
    commands: [
        "{PREFIX}info",
        "{PREFIX}invite",
        "{PREFIX}github",
        "{PREFIX}support",
        "{PREFIX}bug"
    ],
    allowedTypes: ["text", "dm"],
    indexZero: true,
    enabled: true,
    run: (client, message, guild_settings, translation) => {
        const embed = translation.commands.info.embed_reply;
        message.channel.send({ embed }).catch(console.error);
    }
};

module.exports = [info];
