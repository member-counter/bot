import type { Client } from "discord.js";
import { CronJob } from "cron";

import logger from "@mc/logger";

import type { Job } from "../structures/Job";
import { sendBotStats } from "./sendBotStats";
import { setBotStatus } from "./setBotSatus";
import { updateChannels } from "./updateChannels";

const jobs: Job[] = [sendBotStats, setBotStatus, updateChannels];

export function setupJobs(client: Client) {
  jobs.forEach((job) => {
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
