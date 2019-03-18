const prefix = process.env.prefix || require('../../bot-config.json').prefix;
const os = require('os');
const { error } = require('../utils/customConsole');

const parseUptime = (inputDate) => {
    //inputDate must be in seconds
    uptime = new Date(1970, 0, 1);
    uptime.setSeconds(Math.floor(inputDate));
    return `${Math.floor(inputDate/60/60/24)} Days\n${uptime.getHours()} Hours\n${uptime.getMinutes()} Minutes\n${uptime.getSeconds()} Seconds`
}

let command = {
    name: "uptime",
    commands: [prefix+'uptime', "..uptime"],
    indexZero: true,
    enabled: true,
    run: async (client, message, language) => {
        const embed = {
            "color": 16711680,
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
          message.channel.send({ embed }).catch(error);
    }
}
module.exports = command;