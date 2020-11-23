import { Guild, Collection } from 'eris';
import CountService from '../services/CountService';

const countersBeingUpdated: Set<string> = new Set();

const updateCounters = (guilds: Collection<Guild>): void => {
  guilds.forEach(async (guild) => {
    if (countersBeingUpdated.has(guild.id)) return;
    try {
      countersBeingUpdated.add(guild.id);
      const guildCounts = await CountService.init(guild);
      await guildCounts.updateCounters();
    } catch (error) {
      console.error(error);
    } finally {
      countersBeingUpdated.delete(guild.id);
    }
  });
};

export default updateCounters;
