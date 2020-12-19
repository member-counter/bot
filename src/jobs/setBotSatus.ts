import Job from "../typings/Job";
import getEnv from "../utils/getEnv";

const { DISCORD_PREFIX } = getEnv();

const setBotStatus: Job = {
  time: '0 */5 * * * *',
  runAtStartup: true,
  runInOnlyFirstThread: false,
  run: async ({ client }) => {
    client.editStatus('online', {
      name: `${DISCORD_PREFIX}help`,
      type: 3,
    });
  }
}

export default setBotStatus;
