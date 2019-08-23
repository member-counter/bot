const prefix = process.env.DISCORD_PREFIX;
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const { setGuildLanguage, getAvailableLanguages } = require('../utils/language');

const lang = {
    name: "lang",
    commands: [prefix+"lang"],
    allowedTypes: ["text"],
    indexZero: true,
    enabled: false,
    run: async (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            const args = message.content.split(' ');
            const availableLanguages = await getAvailableLanguages();
            let langNotFound = true;
            for (let i in availableLanguages) {
                if (availableLanguages[i] == args[1]) {
                    langNotFound = false;
                    await setGuildLanguage(message.guild.id, availableLanguages[i]);
                    message.channel.send(require(`../lang/${args[1]}.json`).commands.lang.success).catch(console.error);
                    break;
                }
            }
            if (langNotFound) {
                let LangList = "";
                for (let i in availableLanguages) {
                    let langName = require(`../lang/${availableLanguages[i]}.json`).lang_name;
                    LangList += `${availableLanguages[i]} ${langName}\n`;
                }
                message.channel.send(language.commands.lang.error_not_found + '```' + LangList + '```' ).catch(console.error);
            }
        } else {
            message.channel.send(lang.commands.lang.error_no_admin).catch(console.error);
        }
    }
}
module.exports = [ lang ];