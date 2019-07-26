const prefix = process.env.DISCORD_PREFIX;
const os = require('os');
const version = require('../../package.json').version;

const parseUptime = (inputDate) => {
    //inputDate must be in seconds
    uptime = new Date(1970, 0, 1);
    uptime.setSeconds(Math.floor(inputDate));
    return `${Math.floor(inputDate/60/60/24)} Days\n${uptime.getHours()} Hours\n${uptime.getMinutes()} Minutes\n${uptime.getSeconds()} Seconds`
}

let command = {
    name: "info",
    commands: [prefix+'info', "..info"],
    indexZero: true,
    enabled: true,
    run: async (client, message, language) => {
        const embed = {
            "color": 14503424,
            "title": "GitHub",
            "url":"https://github.com/eduardozgz/member-counter-bot",
            "fields": [
              {
                "name": "**Bot version:**",
                "value": version,
                "inline": true
              },
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
module.exports = command;