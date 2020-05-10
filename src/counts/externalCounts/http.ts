import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import * as packageJSON from '../../../package.json';

export default async (resource: string): Promise<number> => {
  let count: number = 0;

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 10 * 1000);

  const response = await fetch(resource, {
    signal: controller.signal,
    headers: {
      'User-Agent': `Member Counter Discord Bot/${packageJSON.version}`,
      Accept: 'text/plain',
    },
  });

  if (
    response.status === 200 &&
    response.headers.get('Content-Type').includes('text/plain')
  ) {
    count = parseInt(await response.text(), 10);
  } else {
    controller.abort();
    count = -2;
  }

  return count;
};
