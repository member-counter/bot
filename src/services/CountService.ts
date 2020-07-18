import Eris from 'eris';
import GuildService from './GuildService';
import { loadLanguagePack } from '../utils/languagePack';
import getEnv from '../utils/getEnv';
import botHasPermsToEdit from '../utils/botHasPermsToEdit';
import shortNumber from '../utils/shortNumbers';
import stringReplaceAsync from '../utils/stringReplaceAsync';
import Constants from '../utils/Constants';
import Counter from '../typings/Counter';

import MyCounter from '../counters/counterTemplate';
import BannedMembersCounter from '../counters/bannedMembers';
import BotStatsCounter from '../counters/bot-stats';
import ChannelCounter from '../counters/channels';
import CountdownCounter from '../counters/countdown';
import GTA5FiveMCounter from '../counters/gta5-fivem';
import GTA5RageMPCounter from '../counters/gta5-ragemp';
import HTTPCounter from '../counters/http';
import httpString from '../counters/httpString';
import HTTPStringCounter from '../counters/httpString';
import MemberCounter from '../counters/members';
import MembersConnectedCounter from '../counters/membersConnected';
import MembersExtendedCounter from '../counters/membersExt';
import MembersWithRoleCounter from '../counters/membersWithRole';
import MinecraftCounter from '../counters/minecraft';
import MixerCounter from '../counters/Mixer';
import RolesCounter from '../counters/roles';
import SoruceCounter from '../counters/source-game';
import TwitchCounter from '../counters/Twitch';
import YouTubeCounter from '../counters/YouTube';
import { type } from 'os';

// Do the aliases lowercase
const counters: Counter[] = [
	MyCounter,
	BannedMembersCounter,
	BotStatsCounter,
	ChannelCounter,
	CountdownCounter,
	GTA5FiveMCounter,
	GTA5RageMPCounter,
	HTTPCounter,
	HTTPStringCounter,
	MemberCounter,
	MembersConnectedCounter,
	MembersExtendedCounter,
	MembersWithRoleCounter,
	MinecraftCounter,
	MixerCounter,
	RolesCounter,
	SoruceCounter,
	TwitchCounter,
	YouTubeCounter,
].map((counter) => {
	counter.aliases = counter.aliases.map((alias) => alias.toLowerCase());
	return counter;
});

const cache = new Map<string, { value: number | string; expiresAt: number }>();

const { FOSS_MODE, PREMIUM_BOT, DEBUG } = getEnv();

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

		for (const [id, rawContent] of this.guildSettings.counters) {
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
		}
	}

	// Legacy counters are those counters that are gonna be in a topic, they can't have the shortNumber option enabled there, because the digits are (or can be) cuztomized
	processContent(content: string, legacy: boolean = false): Promise<string> {
		return stringReplaceAsync(
			content,
			/\{(.+?)\}/gi,
			async (wholeMatch, counterDetected) =>
				await this.processCounter(counterDetected, legacy),
		);
	}

	public async processCounter(
		counterRequested: string,
		legacy: boolean = false,
	): Promise<string> {
		let [counterName, ...params] = counterRequested.split(':');
		counterName = counterName.toLowerCase();
		let resource = params.join(':');
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
								resource,
							})
							.catch((error) => {
								// TODO guild logs
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
							if (Object.prototype.hasOwnProperty.call(returnedValue, key)) {
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

		// Customize digits
		if (legacy) {
			if (Number(result)) {
				result = result
					.toString()
					.split('')
					.map((digit) => this.guildSettings.digits[digit])
					.join('');
			}
		} else {
			const intCount = Number(result);
			if (intCount && this.guildSettings.shortNumber) {
				result = shortNumber(intCount);
			}
		}

		return result.toString();
	}

	private counterToKey(counterName: string, resource: string): string {
		return [counterName, resource].filter((x) => x).join(':');
	}
}

export default CountService;
