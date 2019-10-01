const command = {
    name: "example",
    variants: ["{PREFIX}example"], //command variants
    allowedTypes: ["text", "dm"], //allowed channel types to be executed. See -> https://discord.js.org/#/docs/main/stable/class/Channel?scrollTo=type
    indexZero: true, //When it's true, the command handler will only run the command if any of the command variants are at the start of the message
    enabled: false,
    run: ({ message, guild_settings, translation }) => {
        message.channel.send("Hi!").catch(console.error);
        console.log(guild_settings);
        console.log(translation);
    }
};

module.exports = { command };