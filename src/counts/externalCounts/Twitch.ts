import twitch from 'twitch';
import getEnv from '../../utils/getEnv';

const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = getEnv();

interface stats {
  followers: number;
  views: number;
}

const client = twitch.withClientCredentials(
  TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET,
);

const getChannelStats = async (userName: string): Promise<stats> => {
  const user = await client.kraken.users.getUserByName(userName);
  const { followers, views } = await client.kraken.channels.getChannel(user);
  return { followers, views };
};

const Twitch = { getChannelStats };

export default Twitch;
