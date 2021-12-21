import getEnv from "./getEnv";
import Eris, { GuildTextableChannel, Message } from "eris";
import GuildService from "../services/GuildService";
import { loadLanguagePack } from "./languagePack";
import memberHasAdminPermission from "./memberHasAdminPermission";
import commandErrorHandler from "./commandErrorHandler";
import commands from "../commands/all";
import Bot from "../bot";
import LanguagePack from "../typings/LanguagePack";
import { GuildChannelCommand, AnyChannelCommand } from "../typings/Command";
import UserService from "../services/UserService";
import escapeRegex from "./escapeRegex";
import ClientStatsService from "../services/ClientStatsService";
import daysInCurrentMonth from "../utils/daysInCurrentMonth";
const {
	PREMIUM_BOT,
	DISCORD_PREFIX,
	DISCORD_PREFIX_MENTION_DISABLE,
	DISCORD_DEFAULT_LANG,
	DISCORD_OFFICIAL_SERVER_ID,
	GHOST_MODE,
	BOT_OWNERS
} = getEnv();

export default async (message: Eris.Message) => {
	if (GHOST_MODE && !BOT_OWNERS.includes(message.author?.id)) return;

	const { author, content } = message;
	let { channel } = message;
	const { client } = Bot;

	// Ignore requested commands in the official server since this server already has the premium bot
	if (
		channel instanceof Eris.GuildChannel &&
		!PREMIUM_BOT &&
		channel.guild.id === DISCORD_OFFICIAL_SERVER_ID
	) {
		return;
	}

	// Avoid responding to other bots
	if (author && !author.bot) {
		// fetch dm channel
		if (!message.guildID) {
			message.channel = await message.author.getDMChannel();
			({ channel } = message);
		}

		let prefixToCheck: string;
		let languagePack: LanguagePack;
		let clientIntegrationRoleId: string;
		let guildService: GuildService;

		// upsert the message author in the db
		await UserService.init(author.id);

		if (channel instanceof Eris.GuildChannel) {
			const { guild } = channel;

			guildService = await GuildService.init(guild.id);

			languagePack = loadLanguagePack(guildService.language);
			prefixToCheck = guildService.prefix;

			clientIntegrationRoleId = guild.members
				.get(client.user.id)
				?.roles.filter((roleID) =>
					guild.roles.get(roleID)?.managed ? roleID : null
				)[0];
		} else {
			languagePack = loadLanguagePack(DISCORD_DEFAULT_LANG);
			prefixToCheck = DISCORD_PREFIX;
		}
		prefixToCheck = prefixToCheck.toLowerCase();

		let prefixRegexStr = "^(";

		if (!DISCORD_PREFIX_MENTION_DISABLE) {
			// mention of integration role as prefix
			if (clientIntegrationRoleId) {
				prefixRegexStr += `<@&${clientIntegrationRoleId}>|`;
			}
			// mention as prefix
			prefixRegexStr += `<@!?${client.user.id}>|`;
		}

		// normal prefix
		prefixRegexStr += escapeRegex(prefixToCheck);
		prefixRegexStr += `)\\s*`;

		const prefixRegex = new RegExp(prefixRegexStr, "i");

		const commandRequested = content.toLowerCase(); // Case insensitive match
		const matchedPrefix = commandRequested.match(prefixRegex)?.[0];
		if (matchedPrefix == null) return;

		if (commandRequested.startsWith(matchedPrefix)) {
			commandsLoop: for (const command of commands) {
				for (const alias of command.aliases) {
					let commandAliasToCheck = matchedPrefix + alias.toLowerCase();
					if (commandRequested.startsWith(commandAliasToCheck)) {
						const ClientStats = await ClientStatsService.init(client.user.id);
						let commandStats = ClientStats.commandUsageStats.get(
							JSON.stringify(command.aliases)
						);
						const date = new Date().toLocaleString("en-US", {
							month: "numeric",
							day: "numeric",
							year: "numeric"
						});
						const time = new Date().toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit"
						});
						let stats = commandStats.stats;
						let hourlyUsage = commandStats.hourlyUsage;
						let hourlyUsageIncrement = hourlyUsage + 1;
						let hourlyUsageDate = commandStats.hourlyUsageDate;
						let dailyUsage = commandStats.dailyUsage;
						let dailyUsageIncrement = dailyUsage + 1;
						let dailyUsageDate = commandStats.dailyUsageDate;
						let weeklyUsage = commandStats.weeklyUsage;
						let weeklyUsageIncrement = weeklyUsage + 1;
						let weeklyUsageDate = commandStats.weeklyUsageDate;
						let monthlyUsage = commandStats.monthlyUsage;
						let monthlyUsageIncrement = monthlyUsage + 1;
						let monthlyUsageDate = commandStats.monthlyUsageDate;
						let totalUsage = commandStats.totalUsage;
						let totalUsageIncrement = totalUsage + 1;
						let engagedUsers =
							Object.fromEntries(stats?.entries() ?? new Map())[date]
								?.engagedUsers ?? [];
						let statEntries = Object.entries(
							Object.fromEntries(stats?.entries() ?? new Map())
						);
						let useEntries = Object.entries(
							Object.fromEntries(
								Object.fromEntries(stats?.entries() ?? new Map())[
									date
								]?.uses?.entries() ?? new Map()
							) ?? new Map()
						);
						let uses =
							Object.fromEntries(
								Object.fromEntries(stats?.entries() ?? new Map())[
									date
								]?.uses?.entries() ?? new Map()
							)[time] === undefined
								? 0
								: Object.fromEntries(
										Object.fromEntries(stats?.entries() ?? new Map())[date]
											?.uses
								  )[time];
						let usageStatsForDate = Object.fromEntries(
							ClientStats.commandUsageStatsByDate.entries()
						)[date] ?? { engagedUsers: [], uses: 0 };
						let engagedUsersForDate = usageStatsForDate?.engagedUsers;
						let usesForDate = usageStatsForDate?.uses;
						engagedUsersForDate = [...engagedUsersForDate, "userid"];
						usesForDate = usesForDate + 1;
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
						} else {
							commandStats = Object.assign(commandStats, {
								hourlyUsage: hourlyUsageIncrement
							});
						}
						if (dailyUsageDifference >= 86400000) {
							commandStats = Object.assign(commandStats, {
								dailyUsage: 0,
								dailyUsageDate: new Date()
							});
						} else {
							commandStats = Object.assign(commandStats, {
								dailyUsage: dailyUsageIncrement
							});
						}
						if (weeklyUsageDifference >= 604800000) {
							commandStats = Object.assign(commandStats, {
								weeklyUsage: 0,
								weeklyUsageDate: new Date()
							});
						} else {
							commandStats = Object.assign(commandStats, {
								weeklyUsage: weeklyUsageIncrement
							});
						}
						if (daysInCurrentMonth === 30) {
							if (monthlyUsageDifference >= 2592000000) {
								commandStats = Object.assign(commandStats, {
									monthlyUsage: 0,
									monthlyUsageDate: new Date()
								});
							} else {
								commandStats = Object.assign(commandStats, {
									monthlyUsage: monthlyUsageIncrement
								});
							}
						} else {
							if (monthlyUsageDifference >= 2678400000) {
								commandStats = Object.assign(commandStats, {
									monthlyUsage: 0,
									monthlyUsageDate: new Date()
								});
							} else {
								commandStats = Object.assign(commandStats, {
									monthlyUsage: monthlyUsageIncrement
								});
							}
						}

						commandStats = Object.assign(commandStats, {
							totalUsage: totalUsageIncrement,
							stats: Object.fromEntries(
								new Map([
									...statEntries,
									[
										date,
										{
											engagedUsers: [...engagedUsers, "userid"].filter(
												(v: string, i: number, a: Array<string>) =>
													a.findIndex((t) => t === v) === i
											),
											uses: Object.fromEntries(
												new Map([...useEntries, [time, uses + 1]])
											)
										}
									]
								])
							)
						});
						setTimeout(async () => {
							await ClientStats.setCommandStats(
								JSON.stringify(command.aliases),
								commandStats
							);
							await ClientStats.incrementCommandsRun();
							usageStatsForDate = Object.assign(usageStatsForDate, {
								uses: usesForDate,
								engagedUsers: engagedUsersForDate.filter(
									(v: string, i: number, a: Array<string>) =>
										a.findIndex((t) => t === v) === i
								)
							});
							await ClientStats.setCommandUsageByDate(date, usageStatsForDate);
						}, 100);

						if (channel instanceof Eris.PrivateChannel && command.denyDm) {
							channel
								.createMessage(languagePack.functions.commandHandler.noDm)
								.catch(console.error);
							break commandsLoop;
						}

						if (
							channel instanceof Eris.GuildChannel &&
							(command as GuildChannelCommand).onlyAdmin &&
							!(await memberHasAdminPermission(message.member))
						) {
							channel
								.createMessage(languagePack.common.errorNoAdmin)
								.catch(console.error);
							break commandsLoop;
						}

						try {
							const guild =
								channel instanceof Eris.GuildChannel ? channel.guild : false;
							console.log(
								`${author.username}#${author.discriminator} (${author.id}) [${
									guild ? `Server: ${guild.name} (${guild.id}), ` : ``
								}Channel: ${channel.id}]: ${content}`
							);

							message.content = message.content.replace(prefixRegex, "");

							if (matchedPrefix.startsWith("<@&")) {
								message.roleMentions.shift();
							} else if (matchedPrefix.startsWith("<@")) {
								message.mentions.shift();
							}

							if (channel instanceof Eris.GuildChannel) {
								await (command as GuildChannelCommand).run({
									client,
									message: message as Message<GuildTextableChannel>,
									languagePack,
									guildService
								});
							} else {
								await (command as AnyChannelCommand).run({
									client,
									message,
									languagePack
								});
							}
						} catch (error) {
							commandErrorHandler(channel, languagePack, prefixToCheck, error);
						}
						break commandsLoop;
					}
				}
			}
		}
	}
};
