import CountService from '../services/CountService';
import Job from "../typings/Job";

const guildsBeingUpdated: Set<string> = new Set();

const updateCounters: Job = {
  time: '0 */10 * * * *',
  runAtStartup: false,
  runInOnlyFirstThread: false,
  run: async ({ client }) => {
    client.guilds.forEach(async (guild) => {
      if (guildsBeingUpdated.has(guild.id)) return;
      try {
        guildsBeingUpdated.add(guild.id);
        const guildCounts = await CountService.init(guild);
        await guildCounts.updateCounters();
      } catch (error) {
        console.error(error);
      } finally {
        guildsBeingUpdated.delete(guild.id);
      }
    });
  }
}

export default updateCounters;
