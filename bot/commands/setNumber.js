const prefix = process.env.prefix || require('../../bot-config.json').prefix;
const { log, error } = require('../utils/customConsole');

const command = {
    name: "setNumber",
    commands: [prefix+"setNumber"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
        
    }
}

module.exports = command;