import Eris from 'eris';
import GuildService from './GuildService';
import { loadLanguagePack } from '../utils/languagePack';
import getEnv from '../utils/getEnv';
import botHasPermsToEdit from '../utils/botHasPermsToEdit';
import stringReplaceAsync from '../utils/stringReplaceAsync';
import Constants from '../utils/Constants';
import Counter from '../typings/Counter';

import TestCounter from '../counters/_test';
import ErrorCounter from '../counters/_error';
import BannedMembersCounter from '../counters/bannedMembers';
import BotStatsCounter from '../counters/bot-stats';
import ChannelCounter from '../counters/channels';
import ClockCounter from '../counters/clock';
import CountdownCounter from '../counters/countdown';
import GameCounter from '../counters/game';
import HTTPCounter from '../counters/http';
import HTTPStringCounter from '../counters/httpString';
import InstagramCounter from '../counters/Instagram';
import MemberCounter from '../counters/members';
import MembersConnectedCounter from '../counters/membersConnected';
import MembersExtendedCounter from '../counters/membersExt';
import MembersOnlineApproximatedCounter from '../counters/membersOnlineApproximated';
import MembersWithRoleCounter from '../counters/membersWithRole';
import MemeratorCounter from '../counters/Memerator';
import NitroBoostersCounter from '../counters/nitroBoosters';
import RolesCounter from '../counters/roles';
import StaticCounter from '../counters/static';
import TwitchCounter from '../counters/Twitch';
import TwitterCounter from '../counters/Twitter';
import YouTubeCounter from '../counters/YouTube';

// Do the aliases lowercase
const counters: Counter[] = [
	TestCounter,
	ErrorCounter,
	BannedMembersCounter,
	BotStatsCounter,
	ChannelCounter,
	ClockCounter,
	CountdownCounter,
	GameCounter,
	HTTPCounter,
	HTTPStringCounter,
	InstagramCounter,
	MemberCounter,
	MembersConnectedCounter,
	MembersExtendedCounter,
	MembersOnlineApproximatedCounter,
	MembersWithRoleCounter,
	MemeratorCounter,
	NitroBoostersCounter,
	RolesCounter,
	StaticCounter,
	TwitchCounter,
	TwitterCounter,
	YouTubeCounter,
].map((counter) => {
	counter.aliases = counter.aliases.map((alias) => alias.toLowerCase());
	return counter;
});

const cache = new Map<string, { value: number | string; expiresAt: number }>();

const { FOSS_MODE, PREMIUM_BOT, DEBUG } = getEnv();

setInterval(() => {
	cache.forEach(({ expiresAt }, counterKey) => {
		if (expiresAt < Date.now()) cache.delete(counterKey);
	});
}, 24 * 60 * 60 * 1000);

class CountService {
	private client: Eris.Client;
	public guild: Eris.Guild;
	private guildSettings: GuildService;
	private languagePack: any;
	private tmpCache: Map<string, string>;

	private constructor(guild: Eris.Guild, guildSettings: GuildService) {
		this.guild = guild;
		this.guildSettings = guildSettings;
		this.languagePack = loadLanguagePack(this.guildSettings.language);
		this.tmpCache = new Map<string, string>();
		//@ts-ignore
		this.client = this.guild._client;
	}

	public static async init(guild: Eris.Guild): Promise<CountService> {
		if (guild.unavailable)
			throw new Error(`Eris.Guild ${guild.id} is unavailable`);
		const guildSettings = await GuildService.init(guild.id);
		return new CountService(guild, guildSettings);
	}

	public async updateCounters(): Promise<void> {
		const { channels } = this.guild;
		const { counters } = this.guildSettings;

		Promise.all(
			Array.from(counters).map(async ([id, rawContent]) => {
				const discordChannel = channels.get(id);

				if (!discordChannel) {
					await this.guildSettings.deleteCounter(id);
					return;
				}

				const counterIsNameType =
					discordChannel.type === 2 || discordChannel.type === 4;

				const counterIsTopicType =
					discordChannel.type === 0 || discordChannel.type === 5;

				let processedContent = await this.processContent(
					rawContent,
					counterIsTopicType,
				);

				if (counterIsTopicType) {
					const topicToSet = processedContent.slice(0, 1023);
					if (
						botHasPermsToEdit(discordChannel) &&
						//@ts-ignore
						discordChannel.topic !== topicToSet
					)
						await discordChannel.edit({ topic: topicToSet });
				} else if (counterIsNameType) {
					const nameToSet =
						processedContent.length > 2
							? processedContent.slice(0, 99)
							: this.languagePack.functions.getCounts
									.invalidChannelLength;
					if (
						botHasPermsToEdit(discordChannel) &&
						//@ts-ignore
						discordChannel.name !== nameToSet
					) {
						await discordChannel.edit({ name: nameToSet });
					}
				}
			}),
		);
	}

	// Legacy counters are those counters that are gonna be in a topic, the digits are (or can be) cuztomized
	processContent(content: string, legacy: boolean = false): Promise<string> {
		return stringReplaceAsync(
			content,
			/\{(.+?)\}/gi,
			async (wholeMatch, counterDetected) =>
				this.processCounter(counterDetected, legacy),
		);
	}

	public async processCounter(
		counterRequested: string,
		legacy: boolean = false,
	): Promise<string> {
		interface FormattingSettings {
			locale: string;
			shortNumber: number;
			digits: string[];
		}

		const counterSections = counterRequested.split(':');
		let formattingSettings: FormattingSettings = (() => {
			const settings = {
				locale: this.guildSettings.locale,
				digits: this.guildSettings.digits,
				shortNumber: this.guildSettings.shortNumber,
			}
			try {
				const firstSectionDecoded = Buffer.from(
					counterSections[0],
					'base64',
				).toString('utf-8');
				const overwriteSettings = JSON.parse(firstSectionDecoded);

				counterSections.shift();

				return {
					...settings,
					...overwriteSettings,
				};
			} catch {
				return settings;
			}
		})();

		let counterName = counterSections.shift().toLowerCase();
		let resource = counterSections.join(':');
		let lifetime = 0;
		let result: string | number;

		// GET THE VALUE OF THE COUNTER
		if (
			cache.get(this.counterToKey(counterName, resource))?.expiresAt >
			Date.now()
		)
			result = cache.get(this.counterToKey(counterName, resource)).value;

		if (this.tmpCache.has(this.counterToKey(counterName, resource)))
			result = this.tmpCache.get(
				this.counterToKey(counterName, resource),
			);

		if (!result) {
			for (const counter of counters) {
				if (counter.aliases.includes(counterName)) {
					if (counter.isEnabled) {
						if (counter.isPremium && !(PREMIUM_BOT || FOSS_MODE)) {
							result = Constants.CounterResult.PREMIUM;
							break;
						}

						lifetime = counter.lifetime;

						let returnedValue = await counter
							.execute({
								client: this.client,
								guild: this.guild,
								guildSettings: this.guildSettings,
								resource,
							})
							.catch((error) => {
								if (DEBUG) console.error(error);
								this.guildSettings
									.log(`{${counterRequested}}: ${error}`)
									.catch(console.error);
								return (
									cache.get(
										this.counterToKey(
											counterName,
											resource,
										),
									)?.value || Constants.CounterResult.ERROR
								);
							});

						if (
							typeof returnedValue === 'string' ||
							typeof returnedValue === 'number'
						) {
							returnedValue = {
								[counterName]: returnedValue,
							};
						} else if (typeof returnedValue === 'undefined') {
							returnedValue = {
								[counterName]: Constants.CounterResult.ERROR,
							};
						}

						for (const key in returnedValue) {
							if (returnedValue.hasOwnProperty(key)) {
								let extValue = returnedValue[key];
								let extKey = key.toLowerCase();

								if (typeof extValue === 'string') {
									// nothing, just don't convert it to an error
								} else if (typeof extValue === 'number') {
									extValue = !isNaN(extValue)
										? extValue.toString()
										: Constants.CounterResult.ERROR;
								} else {
									extValue = Constants.CounterResult.ERROR;
								}

								if (lifetime > 0)
									cache.set(
										this.counterToKey(extKey, resource),
										{
											value: extValue,
											expiresAt: Date.now() + lifetime,
										},
									);

								this.tmpCache.set(
									this.counterToKey(extKey, resource),
									extValue.toString(),
								);
							}

							result =
								cache.get(
									this.counterToKey(counterName, resource),
								)?.value ||
								this.tmpCache.get(
									this.counterToKey(counterName, resource),
								);
						}
					} else {
						result = Constants.CounterResult.DISABLED;
					}
					break;
				}
			}
		}

		if (!result) result = Constants.CounterResult.UNKNOWN;

		// PROCESS THE VALUE
		switch (Number(result)) {
			case Constants.CounterResult.PREMIUM:
				result = this.languagePack.functions.getCounts.onlyPremium;
				break;

			case Constants.CounterResult.ERROR:
				result = this.languagePack.common.error;
				break;

			case Constants.CounterResult.UNKNOWN:
				result = this.languagePack.functions.getCounts.unknownCounter;
				break;

			case Constants.CounterResult.DISABLED:
				result = this.languagePack.functions.getCounts.disabled;
				break;
		}

		const intCount = Number(result);
		const isNumber = !isNaN(intCount);
		const isShortNumberEnabled = formattingSettings.shortNumber > -1;
		const isLocaleEnabled = !formattingSettings.locale.includes('disable');

		if (isNumber) {
			if (isShortNumberEnabled || isLocaleEnabled) {
				let locale = 'en';
				let options = {};
				if (isLocaleEnabled) {
					locale = formattingSettings.locale;
				}

				if (isShortNumberEnabled) {
					options = {
						notation: 'compact',
					};
				}

				try {
					result = new Intl.NumberFormat(locale, options).format(
						intCount,
					);
				} catch (err) {
					await this.guildSettings.log(err);
				}
			}

			if (legacy) {
				const { digits } = formattingSettings;
				result = result
					.toString()
					.split('')
					.map((digit) => (digits[digit] ? digits[digit] : digit))
					.join('');
			}
		}

		return result.toString();
	}

	private counterToKey(counterName: string, resource: string): string {
		return [counterName, resource].filter((x) => x).join(':');
	}
}

export default CountService;
