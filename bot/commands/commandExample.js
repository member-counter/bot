const command = {
    name: "example",
    variants: ["example"], //command variants
    allowedTypes: ["text", "dm"], //allowed channel types to be executed. See -> https://discord.js.org/#/docs/main/stable/class/Channel?scrollTo=type
    requiresAdmin: false, //If true, allowedTypes must equal to ["text"] or there might be errors
    run: ({ message, guildSettings, languagePack }) => {
        message.channel.send("Hi!").catch(console.error);
        console.log(guildSettings);
        console.log(languagePack);
    }
};

module.exports = { };