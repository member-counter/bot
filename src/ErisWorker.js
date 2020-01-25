const Base = require('eris-sharder').Base;
const eventHandler = require("./bot/eventHandler");
const setClientStatus = require("./bot/others/setStatus");
const apiHelper = require("./bot/apiHelper");
const GuildsCounts = require("./bot/utils/guildsCounts/GuildsCounts");
const ClusterHub = require("cluster-hub");

// initialized by eris-sharder, it has a eris instance somewhere (this.bot/this.client) with a bunch of discord shards
class ErisWorer extends Base{
    constructor(bot) {
        super(bot);
        this.client = this.bot;
        this.clusterHub = new ClusterHub();
    }

    launch() {
        this.guildsCounts = new GuildsCounts(this);
        eventHandler(this);
        setClientStatus(this.client);
        apiHelper(this);
    }
}
 
module.exports = ErisWorer;
