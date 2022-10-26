import CountService from "../services/CountService";
import Job from "../typings/Job";

const clearCache: Job = {
	time: "* * 23 * * *",
	runAtStartup: false,
	runInOnlyFirstThread: false,
	run: async () => {
		CountService.globalCache.forEach(({ expiresAt }, counterKey) => {
			if (expiresAt < Date.now()) CountService.globalCache.delete(counterKey);
		});
	}
};

export default clearCache;
