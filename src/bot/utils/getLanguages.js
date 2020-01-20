const fs = require("fs");
const path = require("path");

module.exports = () => {
    return new Promise(resolve => {
        fs.readdir(path.join(__dirname, "..", "lang/"), (err, files) => {
            let langMap = new Map();
            if (err) resolve(langMap);
            files.forEach(file => {
                let lang_code = file.split(".")[0];
                langMap.set(lang_code, require(`../lang/${lang_code}.json`));
            });
            resolve(langMap);
        });
    });
};