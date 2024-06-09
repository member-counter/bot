import logger from "@mc/logger";

import { env } from "~/env";
import { Job } from "~/structures/Job";

async function sendStats(url: string, payload: unknown, auth?: string) {
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

export const sendBotStats = new Job({
  name: "Send bot stats",
  time: "0 0 */1 * * *",
  runOnClientReady: true,
  execute: async (client) => {
    // TODO
    const guildCount = 0;

    logger.info("Sending bot stats...");

    await Promise.all([
      sendStats(
        `https://discord.bots.gg/api/v1/bots/${client.user.id}/stats`,
        { guildCount },
        env.DBGG_TOKEN,
      ),
      sendStats(
        `https://top.gg/api/bots/${client.user.id}/stats`,
        {
          server_count: guildCount,
        },
        env.DBL_TOKEN,
      ),
      sendStats(
        `https://botsfordiscord.com/api/bot/${client.user.id}`,
        { server_count: guildCount },
        env.BFD_TOKEN,
      ),
    ]);

    logger.info("Bot stats has been sent");
  },
});
