import Job from "../typings/Job";
import getEnv from "../utils/getEnv";

const { UNRESTRICTED_MODE, PREMIUM_BOT } = getEnv();

const freeMemory: Job = {
	time: "*/30 * * * * *",
	runAtStartup: false,
	runInOnlyFirstThread: false,
	run: async ({ client }) => {
		if (UNRESTRICTED_MODE || PREMIUM_BOT) return;
		const botUser = client.users.get(client.user.id);
		client.users.clear();
		client.users.add(botUser);

		client.guilds.forEach((guild) => {
			const botMember = guild.members.get(client.user.id);
			guild.members.clear();
			guild.members.add(botMember);
		});
	}
};

export default freeMemory;
