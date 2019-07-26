const prefix = process.env.DISCORD_PREFIX;

const command = {
    name: "github",
    commands: [prefix+"github"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
      const embed = language.command.github.embed_reply;
      message.channel.send({embed}).catch(console.error);
    }
}

module.exports = command;