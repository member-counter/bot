import { Job } from "~/structures/Job";

export const sendBotStats = new Job({
  name: "Send bot stats",
  time: "0 0 */1 * * *",
  runOnClientReady: true,
  execute: async (client) => {
    const { logger } = client.botInstanceOptions;

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

    // TODO
    const guildCount = 0;

    logger.info("Sending bot stats...");

    await Promise.all([
      sendStats(
        `https://discord.bots.gg/api/v1/bots/${client.user.id}/stats`,
        { guildCount },
        client.botInstanceOptions.stats.DBGGToken,
      ),
      sendStats(
        `https://top.gg/api/bots/${client.user.id}/stats`,
        {
          server_count: guildCount,
        },
        client.botInstanceOptions.stats.DBLToken,
      ),
      sendStats(
        `https://botsfordiscord.com/api/bot/${client.user.id}`,
        { server_count: guildCount },
        client.botInstanceOptions.stats.BFDToken,
      ),
    ]);

    logger.info("Bot stats has been sent");
  },
});
