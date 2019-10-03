const os = require('os');
const { version } = require('../../package.json');
const getTotalGuildsAndMembers = require("../utils/getTotalGuildsAndMembers");

const parseUptime = (inputDate) => {
    //inputDate must be in seconds
    let uptime = new Date(1970, 0, 1);
    uptime.setSeconds(Math.floor(inputDate));
    return `${Math.floor(inputDate/60/60/24)} Days\n${uptime.getHours()} Hours\n${uptime.getMinutes()} Minutes\n${uptime.getSeconds()} Seconds`
}

let status = {
    name: "status",
    variants: ["{PREFIX}status", "..status"],
    allowedTypes: ["text", "dm"],
    indexZero: true,
    enabled: true,
    run: async ({ message }) => {
        const { client, channel } = message;
        const { totalMembers, totalGuilds } = await getTotalGuildsAndMembers(client);
        const [ loadavg1, loadavg5, loadavg15 ] = os.loadavg();
        const embed = {
            "color": 14503424,
            "title": `Status for shard #${client.shard.id} | Bot version: ${version}`,
            "footer": {
              "icon_url": "https://cdn.discordapp.com/attachments/441295855153315840/464917386563289118/enlarge.png",
              "text": "by eduardozgz#5695"
            },
            "fields": [
              {
                "name": "**Shard process uptime:**",
                "value": parseUptime(((new Date).getTime() - global.spawnedAt.getTime()) / 1000),
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
              },              {
                "name": "**Load avg (1m/5m/15m): **",
                "value": `${(loadavg1 * 100).toPrecision(2)}% - ${(loadavg5 * 100).toPrecision(2)}% - ${(loadavg15 * 100).toPrecision(2)}%`,
                "inline": true
              },
              {
                "name": "**Total users:**",
                "value": totalMembers,
                "inline": true
              },
              {
                "name": "**Total guilds:**",
                "value": totalGuilds,
                "inline": true
              },
              {
                "name": "**Discord API latency:**",
                "value": client.ping + "ms",
                "inline": true
              },
              {
                "name": "**Bot latency:**",
                "value": "Wait...",
                "inline": true
              },
              {
                "name": "**Total shards:**",
                "value": client.shard.count,
                "inline": true
              }
            ]
          };
          channel.send({ embed }).then(message => {
            //Bot latency field
            embed.fields[7].value = `${Date.now() - message.createdAt}ms`;
            message.edit({ embed }).catch(console.error)
          }).catch(console.error);
    }
}
module.exports = { status };
