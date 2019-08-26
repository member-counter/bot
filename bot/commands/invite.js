const prefix = process.env.DISCORD_PREFIX;

const invite = {
    name: "invite",
    commands: [prefix+"invite"],
    allowedTypes: ["text", "dm"],
    indexZero: true,
    enabled: true,
    run: (client, message, translation) => {
		const embed = translation.commands.invite.embed_reply;
		message.channel.send(translation.commands.invite.reply, {embed}).catch(console.error);
    }
}

module.exports = [ invite ];