import os from 'os';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';

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

const status: MemberCounterCommand = {
  aliases: ['uptime', 'status'],
  denyDm: false,
  onlyAdmin: false,
  run: async ({ message }) => {
    const { channel } = message;
    // TODO adapt to new client
    const { client } = channel;
    const { version } = packageJSON;

    const embed = embedBase({
      description: `Bot version: ${version}`,
      fields: [
        {
          name: '**Discord client uptime:**',
          value: parseUptime(client.uptime / 1000),
          inline: true,
        },
        {
          name: '**Process uptime:**',
          value: parseUptime(process.uptime()),
          inline: true,
        },
        {
          name: '**System uptime:**',
          value: parseUptime(os.uptime()),
          inline: true,
        },
        {
          name: '**Server cores:**',
          value: `${os.cpus().length}`,
          inline: true,
        },
        {
          name: '**Load avg:**',
          value: `${os
            .loadavg()[0]
            .toPrecision(2)} - ${os
            .loadavg()[1]
            .toPrecision(2)} - ${os.loadavg()[2].toPrecision(2)}`,
          inline: true,
        },
        {
          name: '**Total memory usage:**',
          value: await (async () => {
            const toGB = (bytes: number): number => {
              return bytes / 1024 / 1024 / 1024;
            };

            const freeMemory = os.freemem(); // TODO
            const totalMemory = os.totalmem(); // TODO
            const memoryUsed = totalMemory - freeMemory;
            const memoryUsage = ((memoryUsed * 100) / totalMemory).toPrecision(
              2,
            );

            return `
            ${toGB(memoryUsed).toPrecision(3)}GB of ${toGB(
              totalMemory,
            ).toPrecision(3)}GB (${memoryUsage}%)`;
          })(),
          inline: true,
        },
        {
          name: '**REST latency:**',
          value: 'Wait...',
          inline: true,
        },
        {
          name: '**BOT latency:**',
          value: `${
            await (async () => {
              const time = process.hrtime()[1];
              await (new Promise(r => setTimeout(r, 0)));
              const latency = (process.hrtime()[1] - time) / 1000000;
              return Number(latency.toPrecision(3)); // remove extra decimals
            })()
          }ms`,
          inline: true,
        },        {
          name: '**Gateway latency:**',
          value: `${client.shards.get(client.guildShardMap[message.guildID] || 0).latency}ms`,
          inline: true,
        },
        {
          name: '**Hostname:**',
          value: `${os.hostname}`,
          inline: true,
        },
        {
          name: '**Shard:**',
          value: `${client.guildShardMap[message.guildID] || 0}`,
          inline: true,
        },
        {
          name: '**Shards:**',
          value: `${client.shards.size}`,
          inline: true,
        },
        {
          name: '**Guilds:**',
          value: `${client.guilds.size}`,
          inline: true,
        },
        {
          name: '**Cached users / In guilds:**',
          value: `${client.users.size} / ${client.guilds.reduce(
            (acc, curr) => acc + curr.memberCount,
            0,
          )}`, // TODO
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
