const commandHandler = require('../utils/commandHandler');

module.exports = (client) => {
    client.on('messageUpdate', (oldMessage, newMessage) => {
        commandHandler(client, newMessage);
    });
}