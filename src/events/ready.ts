import getEnv from '../utils/getEnv';
import postBotStats from '../others/postBotStats';
import checkPremiumGuilds from '../others/checkPremiumGuilds';
import Eris from 'eris';
import updateCounters from '../utils/updateCounters';
import GuildModel from '../models/GuildModel';

const {
	DISCORD_PREFIX,
	UPDATE_COUNTER_INTERVAL,
	FOSS_MODE,
	PREMIUM_BOT,
} = getEnv();

const ready = (client: Eris.Client) => {
	const { users, guilds } = client;

	const setStatus = () => {
		client.editStatus('online', {
			name: `${DISCORD_PREFIX}help`,
			type: 3,
		});
	};

	console.log(`Eris ready!`);

	console.log(
		`Serving to ${client.guilds.reduce(
			(acc, curr) => acc + curr.memberCount,
			0,
		)} users in ${client.guilds.size} guilds`,
	);

	setStatus();
	checkPremiumGuilds(guilds);

	setInterval(() => {
		console.log(
			`Serving to ${client.guilds.reduce(
				(acc, curr) => acc + curr.memberCount,
				0,
			)} users in ${client.guilds.size} guilds`,
		);
		setStatus();
		postBotStats(guilds.size);
		checkPremiumGuilds(guilds);
	}, 1 * 60 * 60 * 1000);

	// update counters, set the interval in the nearest 5min
	setTimeout(
		() => {
			setInterval(() => {
				updateCounters(client.guilds);
			}, UPDATE_COUNTER_INTERVAL * 1000);
		},
		(() => {
			const coeff = 1000 * 60 * 5;
			const date = new Date();
			const rounded = new Date(
				Math.round(date.getTime() / coeff) * coeff,
			);

			return rounded.getTime() - Date.now();
		})(),
	);

	// free ram
	setInterval(() => {
		if (FOSS_MODE || PREMIUM_BOT) return;
		const botUser = client.users.get(client.user.id);
		client.users.clear();
		client.users.add(botUser);

		client.guilds.forEach((guild) => {
			const botMember = guild.members.get(client.user.id);
			guild.members.clear();
			guild.members.add(botMember);
		});
	}, 30 * 1000);

	// check blocked guilds every 1h
	setInterval(() => {
		GuildModel.find({ blocked: true }, { id: 1 }).then((blockedGuilds) => {
			blockedGuilds.forEach((blockedGuild) => {
				client.guilds.get(blockedGuild.id)?.leave().catch(console.error);
			});
		});
	}, 1 * 60 * 60 * 1000);
};

export default ready;
