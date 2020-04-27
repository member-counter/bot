import http from './externalCounts/http';
import YouTube from './externalCounts/YouTube';
import Twitch from './externalCounts/Twitch';
import getEnv from './getEnv';

const { PREMIUM_BOT, FOSS_MODE } = getEnv();

namespace ExternalCounts {
  const fetch = { http, YouTube, Twitch };

  interface countCache {
    count: number;
    expiresAt: number;
  }

  const cache: Map<string, countCache> = new Map();

  export const get = async (counter: string): Promise<number> => {
    let [type, ...resource]: any = counter.slice(1, -1).split(':');
    type = type.toLowerCase();
    resource = resource.join(':');

    if (cache.get(`${type}:${resource}`)?.expiresAt > Date.now()) {
      return cache.get(`${type}:${resource}`).count;
    } else {
      let count = 0;
      let expiresAt = Date.now() + 15000;

      switch (type) {
        case 'youtubesubscribers':
        case 'youtubeviews': {
          if (PREMIUM_BOT || FOSS_MODE) {
            const { subscribers, views } = await fetch.YouTube.getChannelStats(
              resource,
            );

            expiresAt = Date.now() + 60 * 60 * 1000;
            cache.set(`youtubesubscribers:${resource}`, {
              count: subscribers,
              expiresAt,
            });
            cache.set(`youtubeviews:${resource}`, { count: views, expiresAt });

            return cache.get(`${type}:${resource}`).count;
          } else {
            return -1;
          }
        }

        case 'twitchfollowers':
        case 'twitchviews':
        case 'twitcsubscribers': {
          if (PREMIUM_BOT || FOSS_MODE) {
            const { followers, views } = await fetch.Twitch.getChannelStats(
              resource,
            );

            expiresAt = Date.now() + 60 * 60 * 1000;
            cache.set(`twitchfollowers:${resource}`, {
              count: followers,
              expiresAt,
            });
            cache.set(`twitchviews:${resource}`, { count: views, expiresAt });

            return cache.get(`${type}:${resource}`).count;
          } else {
            return -1;
          }
        }

        case 'https':
        case 'http':
          count = await fetch.http(resource);
          expiresAt = Date.now() + 1 * 60 * 1000;
          break;

        default:
          expiresAt = Infinity;
          // -3 = Unknown Counter
          count = -3;
          break;
      }
      cache.set(`${type}:${resource}`, { count, expiresAt });
      return count;
    }
  };
}

export default ExternalCounts;
