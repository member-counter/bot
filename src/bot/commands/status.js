const os = require('os');
const osu = require('node-os-utils');
const { spawn } = require('child_process');
const fs = require('fs').promises;

const { version } = require('../../../package.json');

let status = {
    name: "status",
    variants: ["status", "uptime"],
    allowedTypes: [0, 1],
    requiresAdmin: false,
    run: async ({ client, message }) => {
		const { channel } = message;

        const embed = {
            "color": 14503424,
            "description": `Bot version: ${version}`,
            "footer": {
              "icon_url": "https://cdn.discordapp.com/avatars/343884247263608832/98ce0df05fc35de2510c045cb469e4f7.png?size=64",
              "text": "by eduardozgz#5695"
            },
            "fields": [
				{
					"name": "**Discord client uptime:**",
					"value": parseUptime(client.uptime / 1000),
					"inline": true
				},
				{
					"name": "**Process uptime**",
					"value": parseUptime((Date.now() - process.spawnedAt) / 1000),
					"inline": true
				},
				{
					"name": "**System uptime:**",
					"value": parseUptime(os.uptime()),
					"inline": true
				},
				{
					"name": "**Server cores:**",
					"value": `${os.cpus().length}`,
					"inline": true
				},
				{
					"name": "**Load avg**",
					"value": `${os.loadavg()[0].toPrecision(2)} - ${os.loadavg()[1].toPrecision(2)} - ${os.loadavg()[2].toPrecision(2)}`,
					"inline": true
				},
				{
					"name": "**CPU usage:**",
					"value": "Wait...",
					"inline": true
				},
				{
					"name": "**Total memory usage:**",
					"value": `${toGB(os.totalmem() - await getRealFreeMemory())} of ${toGB(os.totalmem())} (${((os.totalmem() - await getRealFreeMemory()) * 100 / os.totalmem()).toPrecision(2)}%)`,
					"inline": true
				},
				{
					"name": "**Bot latency:**",
					"value": "Wait...",
					"inline": true
				},
				{
					"name": "**Shards:**",
					"value": `${client.shards.size}`,
					"inline": true
				},
				{
					"name": "**Guilds:**",
					"value": `${client.guilds.size}`,
					"inline": true
				},
				{
					"name": "**Users:**",
					"value": `${client.users.size}`,
					"inline": true
				}
            ]
		};
		
		client.createMessage(channel.id, { embed })
			.then(async message => {
				//Git commit
				let commitHash = await new Promise(resolve => {
				let git = spawn("git", ["rev-parse", "HEAD"]);

				let data = "";

				git.stdout.on('data', dataToAdd => data += dataToAdd);

				git.on('close', () => {
					resolve(data);
				});
			});

            let commitHashShort = commitHash.slice(0, 6);
            embed.description += ` ([${commitHashShort}](https://github.com/eduardozgz/member-counter-bot/tree/${commitHash}))`

            //Bot latency field
            embed.fields[7].value = `${Math.abs(Date.now() - message.createdAt)}ms`;

            //cpu usage field
            embed.fields[5].value = `${await osu.cpu.usage()}%`;

            message.edit({ embed }).catch(console.error);
          }).catch(console.error);
    }
};

module.exports = [ status ];

const toGB = (bytes) => {
  return (bytes/1024/1024/1024).toPrecision(3) + "GB";
};

const getRealFreeMemory = () => {
  return new Promise(async resolve => {
    if (process.platform === "linux") {
      const memInfoResult = await fs.readFile("/proc/meminfo", "utf-8")
        .catch((e) => {
            console.error(e);
            resolve(os.freemem());
        });

      let memInfo = {};
      let realFreeMemory = 0;

      memInfoResult.split("\n").forEach(line => {
        memInfo[line.split(/:\s+/)[0]] = parseInt(line.split(/:\s+/)[1], 10) * 1024;
      });

      realFreeMemory = memInfo.MemFree + memInfo.Buffers + memInfo.Cached;

      resolve(realFreeMemory);
    } else {
      resolve(os.freemem());
    }
  });
};

const parseUptime = (inputDate) => {
  //inputDate must be in seconds
  let uptime = new Date(1970, 0, 1);
  uptime.setSeconds(Math.floor(inputDate));
  return `${Math.floor(inputDate/60/60/24)} Days\n${uptime.getHours()} Hours\n${uptime.getMinutes()} Minutes\n${uptime.getSeconds()} Seconds`;
};