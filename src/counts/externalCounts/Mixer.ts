import getEnv from '../../utils/getEnv';
import fetch from 'node-fetch';
import * as packageJSON from '../../../package.json';

interface stats {
  followers: number;
}

const getChannelStats = async (channelUrl: string): Promise<stats> => {

  const response = await fetch(
    `https://mixer.com/api/v1/channels/${channelUrl}`
  ).then((response) => response.json());

  const followers = response?.numFollowers;
  return { followers };
};

const Mixer = { getChannelStats };

export default Mixer;
