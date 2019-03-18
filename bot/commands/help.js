const prefix = process.env.prefix || require('../../bot-config.json').prefix;
const { error } = require('../utils/customConsole');

const command = {
    name: "help",
    commands: [prefix+"help"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
        const args = message.content.split(' ');
        if (args.length < 2) {
            const embed = language.command.help.embed_reply;
            message.channel.send({ embed }).catch(error);
        } else {
            const selectedCommand = language.command[args[1]]
            if (selectedCommand) {
                const embed = {
                    "title": language.command.help.misc.command + " " + args[1].toLowerCase(),
                    "description": selectedCommand.help_description,
                    "color": 0xf2cd00,
                    "author": {
                        "name": "Random Shit",
                        "icon_url": "https://cdn.discordapp.com/avatars/447859277688733707/b201c2693dfa7ea88a988a050037d211.png?size=1024"
                    }
                }
                message.channel.send({ embed }).catch(error);
            }
        }
    }
}
module.exports = command;