import setStatus from "../utils/setStatus";
import Job from "../typings/Job";
import config from "../config";

const {
	discord: {
		bot: { status }
	}
} = config;

const setBotStatus: Job = {
	time: "0 */5 * * * *",
	runAtStartup: true,
	runInOnlyFirstThread: false,
	run: async ({ client }) => {
		if (status?.some((status) => status.match(/\{disable\}/gi))) return;

		let statusToSet = status?.[0] ?? "{online;watching} help";

		if (Math.random() * 100 < 1) {
			statusToSet = status[Math.floor(Math.random() * status.length)];
		}

		setStatus(client, statusToSet);
	}
};

export default setBotStatus;
