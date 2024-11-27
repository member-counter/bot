import { Job } from "~/structures/Job";

export const setBotStatus = new Job({
  name: "Set bot status",
  time: "0 */5 * * * *",
  runOnClientReady: true,
  execute: (client) => {
    const { presenceActivity: activities, presenceStatus: status } =
      client.botInstanceOptions;

    let activity = activities[0];

    if (Math.random() < 0.1) {
      activity = activities[Math.floor(Math.random() * activities.length)];
    }

    if (!activity) return Promise.resolve();

    client.user.setPresence({
      status,
      activities: [activity],
    });

    return Promise.resolve();
  },
});
