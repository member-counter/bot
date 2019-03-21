const prefix = process.env.prefix || require('../../bot-config.json').prefix;
const { log, error } = require('../utils/customConsole');

const command = {
    name: "setTopic",
    commands: [prefix+"setTopic"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
        
    }
}

module.exports = command;