const prefix = process.env.DISCORD_PREFIX;

const github = {
    name: "github",
    commands: [prefix+"github"],
    allowedTypes: ["text", "dm"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
      const embed = language.commands.github.embed_reply;
      message.channel.send({embed}).catch(console.error);
    }
}

module.exports = [ github ];