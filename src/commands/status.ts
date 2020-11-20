import { stat } from 'fs';
import os from 'os';

import * as packageJSON from '../../package.json';
import MemberCounterCommand from '../typings/MemberCounterCommand';
import embedBase from '../utils/embedBase';

const parseUptime = (inputDate: number) => {
  //inputDate must be in seconds
  const uptime = new Date(1970, 0, 1);
  uptime.setSeconds(Math.floor(inputDate));
  return `${Math.floor(
    inputDate / 60 / 60 / 24,
  )} Days\n${uptime.getHours()} Hours\n${uptime.getMinutes()} Minutes\n${uptime.getSeconds()} Seconds`;
};

const toGB = (bytes: number): number => {
  return bytes / 1024 / 1024 / 1024;
};

const status: MemberCounterCommand = {
  aliases: ['uptime', 'status'],
  denyDm: false,
  onlyAdmin: false,
  run: async ({ message, client }) => {
    const { channel } = message;
    const { version } = packageJSON;

    const stats = {
      version: `Bot version: ${version}`, // TODO ADD COMMIT HASH
      clientUptime: parseUptime(client.uptime / 1000),
      processUptime: parseUptime(process.uptime()),
      systemUptime: parseUptime(os.uptime()),
      serverCores: `${os.cpus().length}`, // TODO cluster lenght when using k8s?
      loadAvg: os.loadavg().map(x => x.toPrecision(2)).join(' - '),
      memoryUsage: await (async () => {
        const freeMemory = os.freemem();
        const totalMemory = os.totalmem();
        const memoryUsed = totalMemory - freeMemory;
        const memoryUsage = ((memoryUsed * 100) / totalMemory).toPrecision(
          2,
        );

        return `
        ${toGB(memoryUsed).toPrecision(3)}GB of ${toGB(
          totalMemory,
        ).toPrecision(3)}GB (${memoryUsage}%)`;
      })(), // TODO,
      botLatency: await (async () => {
        const time = process.hrtime()[1];
        await (new Promise(r => setTimeout(r, 0)));
        const latency = (process.hrtime()[1] - time) / 1000000;
        return Number(latency.toPrecision(3)); // remove extra decimals
      })() + 'ms',
      gatewayLatency: client.shards.get(client.guildShardMap[message.guildID] || 0).latency + 'ms',
      hostname: os.hostname(),
      currentShard: '#' + ((client.guildShardMap[message.guildID] || 0) + 1),
      totalShards: client.shards.size.toString(),
      guilds: client.guilds.size.toString(),
      userStats: client.users.size + ' / ' + client.guilds.reduce((acc, curr) => acc + curr.memberCount, 0)
    }

    if (client.getStats) {
      const clientStats = await client.getStats();
      stats.serverCores = clientStats.clusters.length.toString() // TODO TEST cluster lenght when using k8s?
      stats.memoryUsage = toGB(clientStats.memoryUsage.heapUsed) + 'GB' // TODO get total
      stats.totalShards = clientStats.shards.length.toString();
      stats.userStats = clientStats.users + ' / ' + clientStats.estimatedTotalUsers;
      stats.guilds = clientStats.guilds.toString();
    }

    const embed = embedBase({
      description: stats.version,
      fields: [
        {
          name: '**Discord client uptime:**',
          value: stats.clientUptime,
          inline: true,
        },
        {
          name: '**Process uptime:**',
          value: stats.processUptime,
          inline: true,
        },
        {
          name: '**System uptime:**',
          value: stats.systemUptime,
          inline: true,
        },
        {
          name: '**Server cores:**',
          value: stats.serverCores,
          inline: true,
        },
        {
          name: '**Load avg:**',
          value: stats.loadAvg,
          inline: true,
        },
        {
          name: '**Memory usage:**',
          value: stats.memoryUsage,
          inline: true,
        },
        {
          name: '**REST latency:**',
          value: 'Wait...',
          inline: true,
        },
        {
          name: '**BOT latency:**',
          value: stats.botLatency,
          inline: true,
        }, {
          name: '**Gateway latency:**',
          value: stats.gatewayLatency,
          inline: true,
        },
        {
          name: '**Hostname:**',
          value: stats.hostname,
          inline: true,
        },
        {
          name: '**Current shard:**',
          value: stats.currentShard,
          inline: true,
        },
        {
          name: '**Shards:**',
          value: stats.totalShards,
          inline: true,
        },
        {
          name: '**Guilds:**',
          value: stats.guilds,
          inline: true,
        },
        {
          name: '**Cached users / In guilds:**',
          value: stats.userStats,
          inline: true,
        },
      ],
    });

    const RESTLatencyCheck = Date.now();
    await channel.createMessage({ embed }).then(async (message) => {
      // Bot latency field
      embed.fields[6].value = `${Date.now() - RESTLatencyCheck}ms`;

      await message.edit({ embed });
    });
  },
};

const statusCommands = [status];

export default statusCommands;
