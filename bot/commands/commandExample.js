const command = {
    name: "example",
    variants: ["{PREFIX}example"], //command variants
    allowedTypes: ["text", "dm"], //allowed channel types to be executed. See -> https://discord.js.org/#/docs/main/stable/class/Channel?scrollTo=type
    indexZero: true, //When it's true, the command handler will only run the command if any of the command variants are at the start of the message
    enabled: false,
    requiresAdmin: false, //If true, allowedTypes must equal to ["text"] or there might be errors
    run: ({ message, guildSettings, languagePack }) => {
        message.channel.send("Hi!").catch(console.error);
        console.log(guildSettings);
        console.log(languagePack);
    }
};

module.exports = { command };