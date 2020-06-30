import os from 'os';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';

import * as packageJSON from '../../package.json';
import MemberCounterCommand from '../typings/MemberCounterCommand';
import embedBase from '../utils/embedBase';

const getRealFreeMemory = (): Promise<number> => {
  return new Promise(async (resolve) => {
    if (process.platform !== 'linux') {
      resolve(os.freemem());
      return;
    }

    try {
      const memInfoResult = await fs.readFile('/proc/meminfo', 'utf-8');

      let memInfo: any = {};
      let realFreeMemory = 0;

      if (typeof memInfoResult === 'string') {
        memInfoResult.split('\n').forEach((line) => {
          memInfo[line.split(/:\s+/)[0]] =
            parseInt(line.split(/:\s+/)[1], 10) * 1024;
        });
      } else {
        resolve(os.freemem());
        return;
      }

      realFreeMemory = memInfo.MemFree + memInfo.Buffers + memInfo.Cached;

      resolve(realFreeMemory);
    } catch (error) {
      console.error(error);
      resolve(os.freemem());
    }
  });
};

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
          name: '**Process uptime**',
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
          name: '**Load avg**',
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

            const realFreeMemory = await getRealFreeMemory();
            const totalMemory = os.totalmem();
            const memoryUsed = totalMemory - realFreeMemory;
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
          value: `${Date.now() - message.timestamp}ms`,
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
          )}`,
          inline: true,
        },
      ],
    });

    await channel.createMessage({ embed }).then(async (message) => {
      // Bot latency field
      embed.fields[6].value = `${Math.abs(Date.now() - message.createdAt)}ms`;

      await message.edit({ embed });
    });
  },
};

const statusCommands = [status];

export default statusCommands;
