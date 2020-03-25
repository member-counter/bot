const fs = require("fs");
const path = require("path");
const eventsPath = path.join(__dirname, ".", "events", "/");

module.exports = (client) => {

    const eventsToListen = fs.readdirSync(eventsPath).map(file => {   
        let eventName = file.split(".")[0];
        return [eventName, require(eventsPath + file)];
    })

    eventsToListen.forEach(([eventName, callback]) => {
        client.on(eventName, (...data) => callback(client, ...data));
    });

    const debug = process.env.DEBUG ? JSON.parse(process.env.DEBUG) : false;
    if (debug) client.on("debug", console.log);
};
