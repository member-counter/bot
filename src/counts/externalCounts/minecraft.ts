import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import * as packageJSON from '../../../package.json';

export default async (resource: string): Promise<number> => {
  let count: number = 0;

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 10 * 1000);

  const response = await fetch(`https://api.mcsrvstat.us/2/${resource}`, {
    signal: controller.signal,
    headers: {
      'User-Agent': `Member Counter Discord Bot/${packageJSON.version}`,
    },
  });

  if (response.status === 200) {
    const result = await response.json();
    count = result.players.online;
  } else {
    controller.abort();
    count = -2;
  }

  return count;
};
