const prefix = process.env.DISCORD_PREFIX;

const command = {
    name: "example",
    commands: [prefix+"example"],
    indexZero: true, //If is true, the command must be at the start of the message
    enabled: false,
    run: (client, message, language) => {
        message.channel.send('Hi!').catch(console.error);
    }
}

module.exports = command;