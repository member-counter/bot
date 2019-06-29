const { log } = require('../utils/customConsole.js');
const activity = process.env.ACTIVITY;
const status_type = process.env.STATUS_TYPE;

module.exports = (client) => {
    client.on('ready', () => {
        log(`Discord client ready`);
        log(`Serving in ${client.guilds.size} servers, for ${client.users.size} users as ${client.user.tag}`);
        setInterval(()=>{
            client.user.setPresence({ game: { name: activity, type: status_type}});
        }, 15*1000)
    });
}