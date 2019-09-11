const commandHandler = require("../utils/commandHandler");

module.exports = client => {
    client.on("message", commandHandler);
};
