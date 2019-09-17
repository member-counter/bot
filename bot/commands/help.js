const help = {
    name: "help",
    variants: ["{PREFIX}help"],
    allowedTypes: ["text", "dm"],
    indexZero: true,
    enabled: true,
    run: ({ message, guild_settings, translation }) => {
        const { prefix } = guild_settings;
        const { channel, content } = message;
        const args = content.split(/\s+/g);
        if (args.length < 2) {
            let embed = Object.create(translation.commands.help.embed_reply);
            embed.title = embed.title.replace(/\{PREFIX\}/gi, prefix);
            embed.description = embed.description.replace(/\{PREFIX\}/gi, prefix);
            channel.send({ embed }).catch(console.error);
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
                    "description": selectedCommand.help_description.replace(/\{PREFIX\}/gi, prefix),
                    "color": 14503424,
                    "author": {
                        "name": "Member Counter",
                        "icon_url": "https://cdn.discordapp.com/avatars/478567255198662656/e28bfde9b086e9821c31408c2b21304d.png?size=128"
                    }
                }
                channel.send({ embed }).catch(console.error);
            }
        }
    }
}
module.exports = { help };