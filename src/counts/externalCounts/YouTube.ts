import getEnv from '../../utils/getEnv';
import fetch from 'node-fetch';
const { YOUTUBE_API_KEY } = getEnv();

interface stats {
  views: number;
  subscribers: number;
}

const getChannelStats = async (channelUrl: string): Promise<stats> => {
  let channel = channelUrl.replace(
    /^((http|https):\/\/|)(www\.|)youtube\.com\/(channel\/|user\/)/,
    '',
  );
  let searchChannelBy = '';

  if (/^((http|https):\/\/|)(www\.|)youtube\.com\/user\//.test(channelUrl)) {
    searchChannelBy = 'forUsername';
  } else if (
    /^((http|https):\/\/|)(www\.|)youtube\.com\/channel\//.test(channelUrl)
  ) {
    searchChannelBy = 'id';
  } else {
    return { subscribers: -3, views: -3 };
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&key=${YOUTUBE_API_KEY}&${searchChannelBy}=${channel}`,
  ).then((response) => response.json());

  const subscribers = response?.items?.[0]?.statistics?.subscriberCount;
  const views = response?.items?.[0]?.statistics?.viewCount;
  return { subscribers, views };
};

const YouTube = { getChannelStats };

export default YouTube;
