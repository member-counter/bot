import getEnv from '../getEnv';
import twitch from 'twitch';

const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = getEnv();

namespace Twitch {
  const client = twitch.withClientCredentials(
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
  );

  interface stats {
    followers: number;
    views: number;
  }

  export const getChannelStats = async (userName: string): Promise<stats> => {
    const user = await client.kraken.users.getUserByName(userName);
    const { followers, views } = await client.kraken.channels.getChannel(user);
    return { followers, views };
  };
}

export default Twitch;
