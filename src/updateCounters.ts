import { Guild, Collection } from 'eris';
import CountService from './services/CountService';

const countersBeingUpdated = new Set();

const updateCounters = (guilds: Collection<Guild>) => {
  guilds.forEach(async (guild) => {
    if (countersBeingUpdated.has(guild.id)) return;
    try {
      countersBeingUpdated.add(guild.id);
      const guildCounts = new CountService(guild);
      await guildCounts.init();
      await guildCounts.updateCounters();
    } catch (error) {
      console.error(error);
    } finally {
      countersBeingUpdated.delete(guild.id);
    }
  });
};

export default updateCounters;
