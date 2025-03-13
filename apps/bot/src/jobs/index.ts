import type { Job } from "@mc/common/bot/structures/Job";
import type { Client } from "discord.js";
import { CronJob } from "cron";

import { advertise } from "./advertise";
import { checkBlockedGuilds } from "./checkBlockedGuilds";
import { fetchApproximateMemberCount } from "./fetchApproximateMemberCount";
import { sendBotStats } from "./sendBotStats";
import { setBotStatus } from "./setBotSatus";
import { updateChannels } from "./updateChannels";

const jobs: (Job | ((client: Client) => Job))[] = [
  sendBotStats,
  setBotStatus,
  updateChannels,
  fetchApproximateMemberCount,
  checkBlockedGuilds,
  advertise,
];

export function setupJobs(client: Client) {
  const { logger } = client.botInstanceOptions;

  jobs.forEach((job) => {
    if (typeof job === "function") {
      job = job(client);
    }

    let isLocked = false;

    const run = async () => {
      if (isLocked || !client.isReady()) return;
      isLocked = true;

      await job
        .execute(client)
        .catch((error) => logger.error("A job failed", error, job));

      isLocked = false;
    };

    if (job.runOnClientReady) {
      client.on("ready", () => void run());
    }

    new CronJob(job.time, run, null, true);
  });
}
