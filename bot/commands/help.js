const prefix = process.env.DISCORD_PREFIX;

const help = {
    name: "help",
    commands: [prefix+"help"],
    allowedTypes: ["text", "dm"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {        
        const args = message.content.split(' ');
        if (args.length < 2) {
            const embed = language.commands.help.embed_reply;
            message.channel.send({ embed }).catch(console.error);
        } else {
            Object.entries(language.commands)
                .map(x => {
                    x[0] = x[0].toLowerCase();
                    return x
                })
                .forEach(x => {
                    language.commands[x[0]] = x[1]
                })

            const selectedCommand = language.commands[args[1].toLowerCase()]
            if (selectedCommand) {
                const embed = {
                    "title": language.commands.help.misc.command + " " + args[1],
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
module.exports = [ help ];