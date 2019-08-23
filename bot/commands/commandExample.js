const prefix = process.env.DISCORD_PREFIX;

const command = {
    name: "example",
    commands: [prefix+"example"], //command variants
    allowedTypes: ["text", "dm"], //allowed channel types to be executed. See -> https://discord.js.org/#/docs/main/stable/class/Channel?scrollTo=type
    indexZero: true, //When it's true, the command handler will only run the command if any of the command variants are at the start of the message
    enabled: false,
    run: (client, message, language) => {
        message.channel.send('Hi!').catch(console.error);
    }
}

module.exports = command;