const GuildModel = require('../../mongooseModels/GuildModel');
const fs = require('fs');
const path = require('path');
const default_lang = process.env.default_lang || require('../../bot-config.json').default_lang;

const getGuildLanguage = (id) => {
    return new Promise((resolve, reject)=>{
        GuildModel.findOne({guild_id:id})
        .then(result=>{
            (result) ? resolve(result.lang) : resolve(default_lang);
        })
        .catch(e=>{
            reject(e)
        });
    });
}
const setGuildLanguage = (id, langCode) => {
    return new Promise((resolve, reject)=>{
        GuildModel.replaceOne({guild_id:id}, {guild_id:id, lang:langCode}, {upsert: true})
        .then(result=>{
            resolve()
        })
        .catch(e=>{
            reject(e)
        });
    });
}
const getAvailableLanguages = () => {
    return new Promise((resolve, reject)=>{
        fs.readdir(path.join(__dirname, '..', 'lang/'), (err, files) => {
            if (err) reject(err);
            else {
                let langs = []
                files.forEach((element)=>{
                    langs.push(element.split('.')[0]);
                });
                resolve(langs);
            }
        });
    });
}
module.exports = {
    setGuildLanguage,
    getGuildLanguage,
    getAvailableLanguages
}