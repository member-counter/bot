//DELETE
const GuildModel = require('../../mongooseModels/GuildModel');
const fs = require('fs');
const path = require('path');
const default_lang = process.env.DISCORD_DEFAULT_LANG;

const getGuildLanguage = (id) => {
    return new Promise((resolve, reject) => {
        GuildModel.findOne({guild_id:id})
        .then(result => {
            (result) ? resolve(result.lang) : resolve(default_lang);
        })
        .catch(e => {
            reject(e)
        });
    });
}
const setGuildLanguage = (id, langCode) => {
    return new Promise((resolve, reject) => {
        GuildModel.replaceOne({guild_id:id}, {guild_id:id, lang:langCode}, {upsert: true})
        .then(result => {
            resolve()
        })
        .catch(e => {
            reject(e)
        });
    });
}
const getAvailableLanguages = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(path.join(__dirname, '..', 'lang/'), (err, files) => {
            if (err) reject(err);
            else {
                resolve(
                    files.map((file) => file = file.split('.')[0])
                )
            }
        });
    });
}
module.exports = {
    setGuildLanguage,
    getGuildLanguage,
    getAvailableLanguages
}