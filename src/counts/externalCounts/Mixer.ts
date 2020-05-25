import getEnv from '../../utils/getEnv';
import fetch from 'node-fetch';
import * as packageJSON from '../../../package.json';

interface stats {
  followers: number;
}

const getChannelStats = async (username: string): Promise<stats> => {

  const response = await fetch(
    `https://mixer.com/api/v1/channels/${username}`
  ).then((response) => response.json());

  const followers = response?.numFollowers;
  return { followers };
};

const Mixer = { getChannelStats };

export default Mixer;
