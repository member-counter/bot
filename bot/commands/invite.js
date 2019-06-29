const prefix = process.env.PREFIX;
const { error } = require('../utils/customConsole');

const command = {
    name: "invite",
    commands: [prefix+"invite"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
		const embed = language.command.invite.embed_reply;
		message.channel.send(language.command.invite.reply, {embed}).catch(error);
    }
}

module.exports = command;