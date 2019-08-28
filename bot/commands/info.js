const prefix = process.env.DISCORD_PREFIX;

const info = {
    name: "info",
    commands: [prefix+"invite", prefix+"info", prefix+"github", prefix+"support", prefix+"bug"],
    allowedTypes: ["text", "dm"],
    indexZero: true,
    enabled: true,
    run: (client, message, translation) => {
		const embed = translation.commands.info.embed_reply;
		message.channel.send({embed}).catch(console.error);
    }
}

module.exports = [ info ];