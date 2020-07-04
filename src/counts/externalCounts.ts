import Constants from '../utils/Constants';
import http from './externalCounts/http';
import httpString from './externalCounts/httpString';
import YouTube from './externalCounts/YouTube';
import Twitch from './externalCounts/Twitch';
import Mixer from './externalCounts/Mixer';
import minecraft from './externalCounts/minecraft';
import gta5fiveM from './externalCounts/gta5-fivem';
import gta5rageMP from './externalCounts/gta5-ragemp';
import gtasaMTA from './externalCounts/gtasa-mta';
import gtasaMP from './externalCounts/gtasa-mp';
import sourceGame from './externalCounts/source-game';
import getEnv from '../utils/getEnv';

const { PREMIUM_BOT, FOSS_MODE, DEBUG } = getEnv();

const fetch = {
  http,
  httpString,
  YouTube,
  Twitch,
  Mixer,
  minecraft,
  gta5fiveM,
  gta5rageMP,
  gtasaMTA,
  gtasaMP,
  sourceGame,
};

interface countCache {
  count: number | string;
  expiresAt: number;
}

const cache: Map<string, countCache> = new Map();

const get = async (counter: string): Promise<number | string> => {
  let [type, ...resource]: any = counter.slice(1, -1).split(':');
  type = type.toLowerCase();
  resource = resource.join(':');

  if (cache.get(`${type}:${resource}`)?.expiresAt > Date.now()) {
    return cache.get(`${type}:${resource}`).count;
  } else {
    let count: number | string = 0;
    let expiresAt = Date.now() + 15000;

    try {
      switch (type) {
        case 'youtubesubscribers':
        case 'youtubeviews': {
          if (PREMIUM_BOT || FOSS_MODE) {
            expiresAt = Date.now() + 60 * 60 * 1000;
            const { subscribers, views } = await fetch.YouTube.getChannelStats(
              resource,
            );

            cache.set(`youtubesubscribers:${resource}`, {
              count: Number(subscribers),
              expiresAt,
            });
            cache.set(`youtubeviews:${resource}`, { count: Number(views), expiresAt });

            count = cache.get(`${type}:${resource}`).count;

          } else {
            count = Constants.CounterResult.PREMIUM;
          }
          break;
        }
  
        case 'twitchfollowers':
        case 'twitchviews': {
          if (PREMIUM_BOT || FOSS_MODE) {
            expiresAt = Date.now() + 60 * 60 * 1000;
            const { followers, views } = await fetch.Twitch.getChannelStats(
              resource,
            );
  
            cache.set(`twitchfollowers:${resource}`, {
              count: followers,
              expiresAt,
            });
            cache.set(`twitchviews:${resource}`, { count: views, expiresAt });
  
            count = cache.get(`${type}:${resource}`).count;
          } else {
            count = Constants.CounterResult.PREMIUM;
          }
          break;
        }
  
        case 'mixerfollowers': {
          if (PREMIUM_BOT || FOSS_MODE) {
            const { followers } = await fetch.Mixer.getChannelStats(
              resource,
            );
  
            expiresAt = Date.now() + 60 * 60 * 1000;
            count = followers;
          } else {
            count = Constants.CounterResult.PREMIUM;
          }
          break;
        }
  
        case 'https':
        case 'http':
          count = await fetch.http(resource);
          expiresAt = Date.now() + 1 * 60 * 1000;
          break;

        case 'https-string':
        case 'http-string':
            count = await fetch.httpString(resource);
            expiresAt = Date.now() + 1 * 60 * 1000;
            break;
  
        case 'minecraft':
          count = await fetch.minecraft(resource);
          expiresAt = Date.now() + 60 * 1000;
          break;
  
        case 'gta5-fivem':
          count = await fetch.gta5fiveM(resource);
          expiresAt = Date.now() + 60 * 1000;
          break;
  
        case 'gta5-ragemp':
          count = await fetch.gta5rageMP(resource);
          expiresAt = Date.now() + 60 * 1000;
          break;

        case 'gtasa-mta':
          count = await fetch.gtasaMTA(resource);
          break;
  
        case 'gtasa-mp':
          count = await fetch.gtasaMP(resource);
          break;
  
        case 'source':
          count = await fetch.sourceGame(resource);
          break;
  
        default:
          expiresAt = Infinity;
          count = Constants.CounterResult.UNKNOWN;
          break;
      }
    } catch (err) {
      console.error(err);
      count = Constants.CounterResult.ERROR;
    } finally {
      // Just in case if some API decides to return a number as a string, like youtube did
      if (type !== 'http-string') {
        count = Number(count);
      
        if (isNaN(count)) {
          count = Constants.CounterResult.ERROR;
        }
      }

      // Use the cached count if something went wrong
      if (count === Constants.CounterResult.ERROR && cache.has(`${type}:${resource}`)) {
        count = cache.get(`${type}:${resource}`).count;
      }

      cache.set(`${type}:${resource}`, { count, expiresAt });
      return count;
    }
  }
};

const ExternalCounts = { get };

export default ExternalCounts;
