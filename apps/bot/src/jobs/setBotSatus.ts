import { env } from "~/env";
import { Job } from "~/structures/Job";

export const setBotStatus = new Job({
  name: "Set bot status",
  time: "0 */5 * * * *",
  runOnClientReady: true,
  execute: (client) => {
    let activity = env.BOT_PRESENCE_ACTIVITY[0];

    if (Math.random() < 0.1) {
      activity =
        env.BOT_PRESENCE_ACTIVITY[
          Math.floor(Math.random() * env.BOT_PRESENCE_ACTIVITY.length)
        ];
    }

    if (!activity) return Promise.resolve();

    client.user.setPresence({
      activities: [activity],
    });

    return Promise.resolve();
  },
});
