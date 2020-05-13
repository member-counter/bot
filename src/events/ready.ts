import getEnv from '../utils/getEnv';
import postBotStats from '../others/postBotStats';
import checkPremiumGuilds from '../others/checkPremiumGuilds';
import Eris from 'eris';
import updateCounters from '../counts/updateCounters';

const { DISCORD_PREFIX, UPDATE_COUNTER_INTERVAL } = getEnv();

const ready = (client: Eris.Client) => {
  const { users, guilds } = client;

  const setStatus = () => {
    client.editStatus('online', {
      name: `${DISCORD_PREFIX}help`,
      type: 3,
    });
  };

  console.log(`Eris ready!`);

  console.log(`Serving to ${users.size} users in ${client.guilds.size} guilds`);
  setStatus();
  checkPremiumGuilds(guilds);

  setInterval(() => {
    console.log(
      `Serving to ${users.size} users in ${client.guilds.size} guilds`,
    );
    setStatus();
    postBotStats(guilds.size);
    checkPremiumGuilds(guilds);
  }, 1 * 60 * 60 * 1000);

  setInterval(() => {
    updateCounters(client.guilds);
  }, UPDATE_COUNTER_INTERVAL * 1000);
};

export default ready;
