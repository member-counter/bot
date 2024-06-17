import { Redlock } from "@sesamecare-oss/redlock";

import { noop } from "@mc/common/noop";
import { sendBotStatsLockKey } from "@mc/common/redis/keys";
import { redis } from "@mc/redis";

import { Job } from "~/structures/Job";

export const sendBotStats = new Job({
  name: "Send bot stats",
  time: "0 0 */1 * * *",
  runOnClientReady: true,
  execute: async (client) => {
    const { logger } = client.botInstanceOptions;

    async function sendStatsTo(url: string, payload: unknown, auth?: string) {
      if (!auth) return;

      await fetch(url, {
        method: "post",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).catch(logger.error);
    }

    const lock = new Redlock([redis], { retryCount: 0 });

    await lock
      .acquire(
        [sendBotStatsLockKey(client.botInstanceOptions.id)],
        60 * 60 * 1000,
      )
      .then(async () => {
        const botStats = await client.fetchBotStats();
        const guildCount = botStats.reduce((acc, s) => acc + s.guildCount, 0);

        logger.info("Sending bot stats...");

        await Promise.all([
          sendStatsTo(
            `https://discord.bots.gg/api/v1/bots/${client.user.id}/stats`,
            { guildCount },
            client.botInstanceOptions.stats.DBGGToken,
          ),
          sendStatsTo(
            `https://top.gg/api/bots/${client.user.id}/stats`,
            {
              server_count: guildCount,
            },
            client.botInstanceOptions.stats.DBLToken,
          ),
          sendStatsTo(
            `https://botsfordiscord.com/api/bot/${client.user.id}`,
            { server_count: guildCount },
            client.botInstanceOptions.stats.BFDToken,
          ),
        ]);

        logger.info("Bot stats has been sent");
      })
      .catch(noop);
  },
});
