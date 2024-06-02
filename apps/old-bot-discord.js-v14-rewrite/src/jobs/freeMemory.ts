import Job from "../typings/Job";
import config from "../config";

const {
	premium: { thisBotIsPremium },
	unrestrictedMode
} = config;

const freeMemory: Job = {
	time: "*/30 * * * * *",
	runAtStartup: false,
	runInOnlyFirstThread: false,
	run: async ({ client }) => {
		if (unrestrictedMode || thisBotIsPremium) return;
		const botUser = client.users.cache.get(client.user.id);
		client.users.cache.clear();
		client.users.cache.set(botUser.id, botUser);

		client.guilds.cache.forEach((guild) => {
			const botMember = guild.members.cache.get(client.user.id);
			guild.members.cache.clear();
			guild.members.cache.set(botMember.id, botMember);
		});
	}
};

export default freeMemory;
