const prefix = process.env.prefix || require('../../bot-config.json').prefix;
const { error } = require('../utils/customConsole');

const command = {
    name: "github",
    commands: [prefix+"github"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
		const embed = language.command.github.embed_reply;
		message.channel.send({embed}).catch(error);
    }
}

module.exports = command;