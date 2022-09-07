import cron, { CronJob } from "cron";
import Bot from "./bot";
import jobs from "./jobs/all";
import Job from "./typings/Job";

let initialized = false;
const setupJobs = async () => {
	if (initialized) return;
	initialized = true;
	const { client } = Bot;

	async function run(job: Job) {
		if (!job.locked) {
			try {
				job.locked = true;
				await job.run({ client });
			} catch (error) {
				console.error("A job failed:");
				console.error(error);
			} finally {
				job.locked = false;
			}
		}
	}

	for (const job of jobs) {
		if (job.runInOnlyFirstThread && (await client.getFirstShard()) !== 0)
			continue;
		new CronJob(job.time, () => run(job), null, true);
		if (job.runAtStartup) run(job);
	}
};

export default setupJobs;
