const fs = require('fs').promises;
const path = require('path');

const loadCommands = async () => {
    return fs.readdir(path.join(__dirname, "..", "..", "commands/"))
        .then(files => {
            let commands = [];
            files.forEach(file => {
                let commandSet = require("../../commands/" + file);
                commandSet = Object.entries(commandSet).map(i => i = i[1]);
                commands.push(...commandSet);
            });
            return commands;
        })
        .catch(console.error);
};

/**
 * Checks if the language pack exists or not
 * @param {string} langCode
 * @returns {object} - Returns a language pack
 */
const isLanguagePackAvailable = langCode => {
    return fs.readdir(path.join(__dirname, "..", "..", "lang/"))
        .then(files => {
            const availableLangs = files.map((file) => file = file.split('.')[0]);
            return availableLangs.includes(langCode);
        })
        .catch(error  => {
            console.error(error);
            return false;
        });
};

/**
 * Tries to load a language pack, if the given doesn't exists, uses the default (process.env.DISCORD_DEFAULT_LANG)
 * @param {string} langCode 
 * @returns {object} - A language pack
 */
const loadLanguagePack = async langCode => {
    if (await isLanguagePackAvailable(langCode))
        return require(`../../lang/${langCode}.json`);
    else 
        return require(`../../lang/${process.env.DISCORD_DEFAULT_LANG}.json`);
};

module.exports = { loadCommands, loadLanguagePack };