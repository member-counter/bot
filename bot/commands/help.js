const help = {
    name: "help",
    variants: ["{PREFIX}help"],
    allowedTypes: ["text", "dm"],
    indexZero: true,
    enabled: true,
    run: ({ client, message, guild_settings, translation }) => {        
        const args = message.content.split(' ');
        if (args.length < 2) {
            const embed = translation.commands.help.embed_reply;
            embed.title = embed.title.replace(/\{PREFIX\}/gi, guild_settings.prefix);
            embed.description = embed.description.replace(/\{PREFIX\}/gi, guild_settings.prefix);
            message.channel.send({ embed }).catch(console.error);
        } else {
            Object.entries(translation.commands)
                .map(x => {
                    x[0] = x[0].toLowerCase();
                    return x
                })
                .forEach(x => {
                    translation.commands[x[0]] = x[1]
                })

            const selectedCommand = translation.commands[args[1].toLowerCase()]
            if (selectedCommand) {
                const embed = {
                    "title": translation.commands.help.misc.command + " " + args[1],
                    "description": selectedCommand.help_description.replace(/\{PREFIX\}/gi, guild_settings.prefix),
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