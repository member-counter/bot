import CountService from "../services/CountService";
import Job from "../typings/Job";
import getEnv from '../utils/getEnv';

const { PREMIUM_BOT, UNRESTRICTED_MODE } = getEnv();


const clearCache: Job = {
  time: '* * 23 * * *',
  runAtStartup: false,
  runInOnlyFirstThread: false,
  run: async ({ client }) => {
		CountService.cache.forEach(({ expiresAt }, counterKey) => {
      if (expiresAt < Date.now()) CountService.cache.delete(counterKey);
    });
  }
}

export default clearCache;