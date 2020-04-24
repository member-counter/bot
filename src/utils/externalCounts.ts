import fetch from './externalCounts/index';

interface countCache {
  count: number;
  expiresAt: number;
}

const cache: Map<string, countCache> = new Map();

const fetchExternalCount = async (type: string): Promise<number> => {
  const rawType = type;
  type = type.toLowerCase();
  if (cache.get(type)?.expiresAt > Date.now()) {
    return cache.get(type).count;
  } else {
    let count = 0;
    let expiresAt = Date.now() + 15000;

    if (/\{youtubesubscribers:.+\}/.test(type)) {
      // TODO
      return -3;
    } else if (/\{twitchsubscribers:.+\}/.test(type)) {
      // TODO
      return -3;
    } else if (/\{twitchfollowers:.+\}/.test(type)) {
      // TODO
      return -3;
    } else if (/\{https?:.+\}/.test(type)) {
      let resource = '';

      if (/\{http:.+\}/.test(type)) resource = type.slice(6, -1);
      else if (/\{https:.+\}/.test(type)) resource = type.slice(7, -1);

      count = await fetch.http(resource);
    } else if (/\{minecraft:.+\}/.test(type)) {
      // TODO
      return -3;
    } else {
      // -3 = Unknown Count
      return -3;
    }
    cache.set(type, { count, expiresAt });
    return count;
  }
};

export default fetchExternalCount;
