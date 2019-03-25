const prefix = process.env.prefix || require('../../bot-config.json').prefix;
const { log, error } = require('../utils/customConsole');
const version = require('../../package.json').version;

const command = {
    name: "version",
    commands: [prefix+"version", prefix+"v", "..version", "..v"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
        const embed = {
            "color": 14503424,
            "title": "GitHub",
            "url":"https://github.com/eduardozgz/member-counter-bot",
            "fields": [
              {
                "name": "**Bot version:**",
                "value": version,
                "inline": true
              }
            ]
        }
        message.channel.send({ embed }).catch(error);
    }
}

module.exports = command;