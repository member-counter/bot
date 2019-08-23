const prefix = process.env.DISCORD_PREFIX;

const command = {
    name: "invite",
    commands: [prefix+"invite"],
    allowedTypes: ["text", "dm"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
		const embed = language.commands.invite.embed_reply;
		message.channel.send(language.commands.invite.reply, {embed}).catch(console.error);
    }
}

module.exports = command;