import setStatus from "../others/setStatus";
import Job from "../typings/Job";
import getEnv from "../utils/getEnv";

const { DISCORD_STATUS } = getEnv();

const setBotStatus: Job = {
	time: "0 */5 * * * *",
	runAtStartup: true,
	runInOnlyFirstThread: false,
	run: async ({ client }) => {
		let statusToSet = DISCORD_STATUS?.[0] ?? "{online;watching} {prefix}help";

		if (Math.random() * 100 < 1) {
			statusToSet =
				DISCORD_STATUS[Math.floor(Math.random() * DISCORD_STATUS.length)];
		}

		setStatus(client, statusToSet);
	}
};

export default setBotStatus;
