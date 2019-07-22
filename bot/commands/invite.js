const prefix = process.env.PREFIX;

const command = {
    name: "invite",
    commands: [prefix+"invite"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
		const embed = language.command.invite.embed_reply;
		message.channel.send(language.command.invite.reply, {embed}).catch(console.error);
    }
}

module.exports = command;