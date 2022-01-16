import { Client } from "eris";
import ClientStatsService from "../services/ClientStatsService";
import commands from "../commands/all";
async function initializeCommandStats(client: Client) {
	const ClientStats = await ClientStatsService.init(client.user.id);
	const delays: Array<number> = new Array(commands.length)
		.fill(0)
		.map((ele, index, array) => {
			return array[index - 1] !== undefined || !isNaN(array[index - 1])
				? (array[index] = array[index - 1] + 125)
				: (array[index] = ele);
		});

	commands.forEach((command, index) => {
		if (!ClientStats.commandUsageStats.has(JSON.stringify(command.aliases))) {
			setTimeout(async () => {
				await ClientStats.setCommandStats(JSON.stringify(command.aliases), {
					hourlyUsage: 0,
					hourlyUsageDate: new Date(),
					dailyUsage: 0,
					dailyUsageDate: new Date(),
					weeklyUsage: 0,
					weeklyUsageDate: new Date(),
					monthlyUsage: 0,
					monthlyUsageDate: new Date(),
					totalUsage: 0,
					stats: Object.fromEntries(new Map())
				});
			}, delays[index]);
		}
	});
}
export default initializeCommandStats;
