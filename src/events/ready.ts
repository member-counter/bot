import getEnv from '../utils/getEnv';
import postBotStats from '../others/postBotStats';
import checkPremiumGuilds from '../others/checkPremiumGuilds';
import Eris from 'eris';

const { DISCORD_PREFIX } = getEnv();

const setStatus = (client: Eris.Client) => {
  client.editStatus('online', {
    name: `${DISCORD_PREFIX}help`,
    type: 3,
  });
};

const ready = (client: Eris.Client) => {
  const { users, guilds } = client;

  console.log(`Eris ready!`);

  setStatus(client);
  checkPremiumGuilds(guilds);

  setInterval(() => {
    console.log(
      `Serving to ${users.size} users in ${client.guilds.size} guilds`,
    );
    setStatus(client);
    postBotStats(guilds.size);
    checkPremiumGuilds(guilds);
  }, 5 * 60 * 1000);
};

export default ready;
