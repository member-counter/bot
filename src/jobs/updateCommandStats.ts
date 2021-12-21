import Job from "../typings/Job";
import ClientStatsService from "../services/ClientStatsService";
import commands from "../commands/all";
import daysInCurrentMonth from "../utils/daysInCurrentMonth";
const updateCommandStats: Job = {
	time: "0 */30 * * * *",
	runAtStartup: true,
	runInOnlyFirstThread: false,
	run: async ({ client }) => {
		const delays: Array<number> = new Array(commands.length)
			.fill(0)
			.map((ele, index, array) => {
				return array[index - 1] !== undefined || !isNaN(array[index - 1])
					? (array[index] = array[index - 1] + 125)
					: (array[index] = ele);
			});
		const ClientStats = await ClientStatsService.init(client.user.id);
		commands.forEach((command, index) => {
			let commandStats = ClientStats.commandUsageStats.get(
				JSON.stringify(command.aliases)
			);
			let hourlyUsageDate = commandStats.hourlyUsageDate;
			let dailyUsageDate = commandStats.dailyUsageDate;
			let weeklyUsageDate = commandStats.weeklyUsageDate;
			let monthlyUsageDate = commandStats.monthlyUsageDate;
			let hourlyUsageDifference =
				new Date().getTime() - hourlyUsageDate.getTime();
			let dailyUsageDifference =
				new Date().getTime() - dailyUsageDate.getTime();
			let weeklyUsageDifference =
				new Date().getTime() - weeklyUsageDate.getTime();
			let monthlyUsageDifference =
				new Date().getTime() - monthlyUsageDate.getTime();

			if (hourlyUsageDifference >= 3600000) {
				commandStats = Object.assign(commandStats, {
					hourlyUsage: 0,
					hourlyUsageDate: new Date()
				});
			}
			if (dailyUsageDifference >= 86400000) {
				commandStats = Object.assign(commandStats, {
					dailyUsage: 0,
					dailyUsageDate: new Date()
				});
			}
			if (weeklyUsageDifference >= 604800000) {
				commandStats = Object.assign(commandStats, {
					weeklyUsage: 0,
					weeklyUsageDate: new Date()
				});
			}
			if (daysInCurrentMonth === 30) {
				if (monthlyUsageDifference >= 2592000000) {
					commandStats = Object.assign(commandStats, {
						monthlyUsage: 0,
						monthlyUsageDate: new Date()
					});
				}
			} else {
				if (monthlyUsageDifference >= 2678400000) {
					commandStats = Object.assign(commandStats, {
						monthlyUsage: 0,
						monthlyUsageDate: new Date()
					});
				}
			}
			setTimeout(async () => {
				await ClientStats.setCommandStats(
					JSON.stringify(command.aliases),
					commandStats
				);
			}, delays[index]);
		});
	}
};

export default updateCommandStats;
