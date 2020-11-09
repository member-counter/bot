import { Guild, Collection } from 'eris';
import CountService from '../services/CountService';

const guildsBeingUpdated: Set<string> = new Set();

const updateCounters = (guilds: Collection<Guild>): void => {
  guilds.forEach(async (guild) => {
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
};

export default updateCounters;
