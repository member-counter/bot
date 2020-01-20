const help = {
    name: "help",
    variants: ["help"],
    allowedTypes: [0, 1],
    requiresAdmin: false,
    run: ({ bot, message, guildSettings, languagePack }) => {
        const { client } = bot;
        const { prefix } = guildSettings;
        const { channel, content } = message;

        const args = content.split(/\s+/g);
        if (args.length < 2) {
            //Main help

            //Create a new object because when {PREFIX} is replaced, it's replaced in the cached XX_xx.json, so it's only replaced once
            let embed = { ...languagePack.commands.help.embed_reply };

            //When this line is uncommented, it the color works.
            //  embed.color = embed.color;

            //replace {PREFIX} keywords in the language pack so its matches the guild settings
            embed.title = embed.title.replace(/\{PREFIX\}/gi, prefix);
            embed.description = embed.description.replace(/\{PREFIX\}/gi, prefix).replace(/\{WEBSITE\}/gi, process.env.WEBSITE);

            client.createMessage(channel.id, { embed }).catch(console.error);
        } else {
            //Help for the specified command

            //Get index of the command (to make the seconds arg case insensitive)
            let selectedCommand = null;
            Object.keys(languagePack.commands)
                .forEach((command) => {
                    if (command.toLowerCase() === args[1].toLowerCase()) selectedCommand = command;
                })

            if (selectedCommand) {
                const embed = {
                    "title": languagePack.commands.help.misc.command + " " + selectedCommand,
                    "description": languagePack.commands[selectedCommand].help_description.replace(/\{PREFIX\}/gi, prefix),
                    "color": 14503424,
                    "author": {
                        "name": "Member Counter",
                        "icon_url": "https://cdn.discordapp.com/avatars/478567255198662656/e28bfde9b086e9821c31408c2b21304d.png?size=128"
                    }
                };

                client.createMessage(channel.id, { embed }).catch(console.error);
            }
        }
    }
};

module.exports = { help };