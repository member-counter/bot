const fs = require("fs");
const path = require("path");
const eventsPath = path.join(__dirname, "..", "events", "/");

module.exports = client => {
    fs.readdirSync(eventsPath).forEach(file => {
        if (file !== "index.js") require(eventsPath + file)(client);
    });
};
