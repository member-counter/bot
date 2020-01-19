const Base = require('eris-sharder').Base;
const eventHandler = require("./bot/eventHandler");
const setStatus = require("./bot/others/setStatus");

class Bot extends Base{
    constructor(bot) {
        super(bot);
        this.client = this.bot;
    }

    launch() {
        const { client } = this;
        eventHandler(client);
        setStatus(client);
    }
}
 
module.exports = Bot;
