const { error } = require('../utils/customConsole');

module.exports = (client) => {
    client.on('error', error);
}