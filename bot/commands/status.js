const prefix = process.env.DISCORD_PREFIX;
const os = require('os');
const { version } = require('../../package.json');
const mongoose = require('mongoose');

const parseUptime = (inputDate) => {
    //inputDate must be in seconds
    uptime = new Date(1970, 0, 1);
    uptime.setSeconds(Math.floor(inputDate));
    return `${Math.floor(inputDate/60/60/24)} Days\n${uptime.getHours()} Hours\n${uptime.getMinutes()} Minutes\n${uptime.getSeconds()} Seconds`
}

let status = {
    name: "status",
    commands: [prefix+'status', "..status"],
    allowedTypes: ["text", "dm"],
    indexZero: true,
    enabled: true,
    run: async (client, message, language) => {
        const embed = {
            "color": 14503424,
            "title":"Status for shard #" + client.shard.id + " | Bot version: " + version,
            "footer": {
              "icon_url": "https://cdn.discordapp.com/attachments/441295855153315840/464917386563289118/enlarge.png",
              "text": "by eduardozgz#5695"
            },
            "fields": [
              {
                "name": "**Discord client uptime:**",
                "value": parseUptime(client.uptime / 1000),
                "inline": true
              },
              {
                "name": "**System uptime:**",
                "value": parseUptime(os.uptime()),
                "inline": true
              }      
            ]
          };
          message.channel.send({ embed }).catch(console.error);
    }
}
module.exports = [ status ];