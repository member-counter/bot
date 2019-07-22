const prefix = process.env.PREFIX;

const command = {
    name: "help",
    commands: [prefix+"help"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
        const args = message.content.split(' ');
        if (args.length < 2) {
            const embed = language.command.help.embed_reply;
            message.channel.send({ embed }).catch(console.error);
        } else {
            const selectedCommand = language.command[args[1]]
            if (selectedCommand) {
                const embed = {
                    "title": language.command.help.misc.command + " " + args[1].toLowerCase(),
                    "description": selectedCommand.help_description,
                    "color": 14503424,
                    "author": {
                        "name": "Member Counter",
                        "icon_url": "https://cdn.discordapp.com/avatars/478567255198662656/e28bfde9b086e9821c31408c2b21304d.png?size=128"
                    }
                }
                message.channel.send({ embed }).catch(console.error);
            }
        }
    }
}
module.exports = command;