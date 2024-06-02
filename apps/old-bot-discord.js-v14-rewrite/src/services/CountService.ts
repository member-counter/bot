<<<<<<<< HEAD:apps/old-bot/src/services/CountService.ts
import Eris from "eris";
import GuildService from "./GuildService";
import { loadLanguagePack } from "../utils/languagePack";
import getEnv from "../utils/getEnv";
import botHasPermsToEdit from "../utils/botHasPermsToEdit";
import { CounterError } from "../utils/Constants";
import Counter from "../typings/Counter";
import FormattingSettings from "../typings/FormattingSettings";
import counters from "../counters/all";
import { Bot, ErisClient } from "../bot";
import LanguagePack from "../typings/LanguagePack";
========
/* eslint-disable prefer-destructuring */
import { ChannelType } from "discord-api-types/v10";
import {
	Client,
	ChatInputCommandInteraction,
	Guild,
	Interaction,
	TextChannel
} from "discord.js";
>>>>>>>> discord.js-v14-rewrite:apps/old-bot-discord.js-v14-rewrite/src/services/CountService.ts

import config from "../config";
import Constants from "../Constants";
import counters from "../counters/all";
import logger from "../logger";
import { i18nInstanceType, i18nService } from "../services/i18n";
import Counter from "../typings/Counter";
import CounterFormattingSettings from "../typings/CounterFormattingSettings";
import { botHasPermsToEdit } from "../utils";
import GuildService from "./GuildSettings";

const {
	debug: DEBUG,
	ghostMode,
	premium: { thisBotIsPremium: PREMIUM_BOT },
	unrestrictedMode: UNRESTRICTED_MODE
} = config;
class CountService {
	private static counters = counters.map((counter) => {
		return {
			...counter,
			aliases: counter.aliases.map((alias) =>
				CountService.safeCounterName(alias)
			)
		};
	});

	public static globalCache = new Map<
		string,
		{ value: number | string; expiresAt: number }
	>();
	private client: Client;
	public guild: Guild;
	private guildSettings: GuildService;
	private i18nInstance: i18nInstanceType;

	private localCache: Map<string, string | number>;

	private constructor(
		guild: Guild,
		guildSettings: GuildService,
		i18nInstance: i18nInstanceType
	) {
		this.guild = guild;
		this.guildSettings = guildSettings;
		this.i18nInstance = i18nInstance;
		this.localCache = new Map();
		this.client = guild.client;
	}

	public static async init(
		guild: Guild,
		interaction: string | Interaction | ChatInputCommandInteraction
	): Promise<CountService> {
		if (!guild.available) throw new Error(`Guild ${guild.id} is unavailable`);
		const guildSettings = await GuildService.init(guild.id);
		const i18nInstance = await i18nService(interaction);
		return new CountService(guild, guildSettings, i18nInstance);
	}

	public async updateCounters(): Promise<void> {
		const { channels } = this.guild;
		const { counters } = this.guildSettings;

		for (const [id, rawContent] of counters) {
			try {
				const discordChannel = channels.cache.get(id);

				if (!discordChannel) {
					await this.guildSettings.deleteCounter(id);
					continue;
				}

				const counterIsNameType =
					discordChannel.type === ChannelType.GuildVoice ||
					discordChannel.type === ChannelType.GuildCategory;

				const counterIsTopicType =
					discordChannel.type === ChannelType.GuildText ||
					discordChannel.type === ChannelType.GuildAnnouncement;

				const processedContent = await this.processContent(
					rawContent,
					counterIsTopicType
				);

				if (counterIsTopicType) {
					const topicToSet = processedContent.slice(0, 1023);
					if (
						botHasPermsToEdit(discordChannel) &&
						(discordChannel as TextChannel).topic !== topicToSet
					) {
						if (ghostMode) return;
						await discordChannel.edit({ topic: topicToSet });
					}
				} else if (counterIsNameType) {
					const nameToSet =
						processedContent.length > 2
							? processedContent.slice(0, 99)
							: this.i18nInstance.t(
									"service.countService.getCounts.invalidChannelLength"
							  );
					if (
						botHasPermsToEdit(discordChannel) &&
						discordChannel.name !== nameToSet
					) {
						if (ghostMode) return;
						await discordChannel.edit({ name: nameToSet });
					}
				}
			} catch (err) {
				logger.error(err);
			}
		}
	}

	public async processContent(
		content: string,
		canHaveCustomEmojis = false
	): Promise<string> {
		// Check if there are counters pending to be processed
		while (/\{(.+?)\}/g.test(content)) {
			for (
				let i = 0, curlyOpenAt: number = null, isNested = false;
				i < content.length;
				i++
			) {
				const char = content[i];

				if (char === "{") {
					if (curlyOpenAt !== null) {
						isNested = true;
					}
					curlyOpenAt = i;
				} else if (curlyOpenAt !== null && char === "}") {
					const curlyClosedAt = i;

					content =
						content.substring(0, curlyOpenAt) +
						(await this.processCounter(
							content.substring(curlyOpenAt + 1, curlyClosedAt),
							// never customize digits if it's nested so the parent counter can process the result correctly
							isNested ? false : canHaveCustomEmojis
						)) +
						content.substring(curlyClosedAt + 1);

					break;
				}
			}
		}

		return content;
	}

	public async processCounter(
		counterRequested: string,
		canHaveCustomEmojis = false
	): Promise<string> {
		const counterSections = counterRequested
			.split(/(?<!\\):/)
			.map((section) =>
				section.replace("\\:", ":")
			) as typeof counters[number]["aliases"][number][];
		let formattingSettingsRaw: string;
		const formattingSettings: CounterFormattingSettings = (() => {
			const settings = {
				locale: this.guildSettings.locale,
				digits: this.guildSettings.digits,
				shortNumber: this.guildSettings.shortNumber
			};
			try {
				const firstSectionDecoded = Buffer.from(
					counterSections[0],
					"base64"
				).toString("utf-8");
				const specificSettings = JSON.parse(firstSectionDecoded);

				formattingSettingsRaw = counterSections.shift();

				return {
					...settings,
					...specificSettings
				};
			} catch {
				return settings;
			}
		})();

		const counterName = CountService.safeCounterName(counterSections.shift());
		const resource = counterSections.join(":");
		let lifetime = 0;
		let result: string | number;
		let error: CounterError | null;

		// Try to get the value from the cache
		if (
			CountService.globalCache.get(
				this.counterToKey(counterName, resource, formattingSettingsRaw)
			)?.expiresAt > Date.now()
		)
			result = CountService.globalCache.get(
				this.counterToKey(counterName, resource, formattingSettingsRaw)
			).value;

		if (
			this.localCache.has(
				this.counterToKey(counterName, resource, formattingSettingsRaw)
			)
		)
			result = this.localCache.get(
				this.counterToKey(counterName, resource, formattingSettingsRaw)
			);

		// else, process the counter
		if (result === undefined) {
			const counter = CountService.getCounterByAlias(counterName, true);

			if (!counter) {
				error = CounterError.UNKNOWN;
			} else if (!counter.isEnabled) {
				error = CounterError.DISABLED;
			} else if (counter.isPremium && !(PREMIUM_BOT || UNRESTRICTED_MODE)) {
				error = CounterError.PREMIUM;
			} else {
				lifetime = counter.lifetime;

				const unparsedArgs = counterSections.join(":");
				const args = counterSections.map((section) =>
					section.split(/(?<!\\),/).map((arg) => arg.replace(/\\(.)/g, "$1"))
				);

				let returnedValue = await counter
					.execute({
						client: this.client,
						guild: this.guild,
						guildSettings: this.guildSettings,
						aliasUsed: counterName,
						formattingSettings,
						unparsedArgs,
						args
					})
<<<<<<<< HEAD:apps/old-bot/src/services/CountService.ts
					.catch((executionError) => {
						if (DEBUG) console.error(executionError);
						this.guildSettings
							.log(`{${counterRequested}}: ${executionError}`)
							.catch(console.error);

						error = executionError;

						return CountService.globalCache.get(
							this.counterToKey(counterName, resource, formattingSettingsRaw)
						)?.value;
========
					.catch((error) => {
						if (DEBUG) logger.error(error);
						this.guildSettings
							.log(`{${counterRequested}}: ${error}`)
							.catch(logger.error);
						return (
							CountService.globalCache.get(
								this.counterToKey(counterName, resource, formattingSettingsRaw)
							)?.value ?? Constants.CounterResult.ERROR
						);
>>>>>>>> discord.js-v14-rewrite:apps/old-bot-discord.js-v14-rewrite/src/services/CountService.ts
					});

				if (
					typeof returnedValue === "string" ||
					typeof returnedValue === "number"
				) {
					returnedValue = {
						[counterName]: returnedValue
					};
				} else if (typeof returnedValue === "undefined" && !error) {
					error = CounterError.ERROR;
				}

				for (const key in returnedValue) {
					if (Object.prototype.hasOwnProperty.call(returnedValue, key)) {
						const extKey = CountService.safeCounterName(
							key as typeof counters[number]["aliases"][number]
						);
						let extValue = returnedValue[key];

						if (typeof extValue === "string") {
							// nothing, just don't convert it to an error
						} else if (typeof extValue === "number") {
							if (isNaN(extValue)) extValue = CounterError.ERROR;
						} else {
							extValue = CounterError.ERROR;
						}

						if (lifetime > 0)
							CountService.globalCache.set(
								this.counterToKey(extKey, resource, formattingSettingsRaw),
								{
									value: extValue,
									expiresAt: Date.now() + lifetime
								}
							);

						this.localCache.set(
							this.counterToKey(extKey, resource, formattingSettingsRaw),
							extValue
						);
					}

					result =
						CountService.globalCache.get(
							this.counterToKey(counterName, resource, formattingSettingsRaw)
						)?.value ??
						this.localCache.get(
							this.counterToKey(counterName, resource, formattingSettingsRaw)
						);
				}
			}
		}

<<<<<<<< HEAD:apps/old-bot/src/services/CountService.ts
		if (error) {
			const errorMessageKey = {
				[CounterError.PREMIUM]: "onlyPremium",
				[CounterError.UNKNOWN]: "unknownCounter",
				[CounterError.DISABLED]: "disabled",
				[CounterError.NOT_AVAILABLE]: "notAvailable"
			};

			result = this.languagePack.functions.getCounts[errorMessageKey[error]];
			result ??= this.languagePack.common.error;
========
		// If the result is some error, display it
		switch (result) {
			case Constants.CounterResult.PREMIUM:
				result = this.i18nInstance.t(
					"service.countService.getCounts.onlyPremium"
				);
				break;

			case Constants.CounterResult.ERROR:
				result = this.i18nInstance.t("common.error.generic");
				break;

			case Constants.CounterResult.UNKNOWN:
				result = this.i18nInstance.t(
					"service.countService.getCounts.unknownCounter"
				);
				break;

			case Constants.CounterResult.DISABLED:
				result = this.i18nInstance.t("service.countService.getCounts.disabled");
				break;

			case Constants.CounterResult.NOT_AVAILABLE:
				result = this.i18nInstance.t(
					"service.countService.getCounts.notAvailable"
				);
				break;
>>>>>>>> discord.js-v14-rewrite:apps/old-bot-discord.js-v14-rewrite/src/services/CountService.ts
		}

		// format result if it's a number according to the formatting settings
		if (typeof result === "number" && !isNaN(result)) {
			const isShortNumberEnabled = formattingSettings.shortNumber > -1;
			const isLocaleEnabled = !formattingSettings.locale?.includes("disable");
			if (isShortNumberEnabled || isLocaleEnabled) {
				let locale = "en";
				let options = {};
				if (isLocaleEnabled) {
					locale = formattingSettings.locale;
				}

				if (isShortNumberEnabled) {
					options = {
						notation: "compact"
					};
				}

				try {
					result = new Intl.NumberFormat(locale, options).format(result);
				} catch (err) {
					await this.guildSettings.log(err);
				}
			}

			if (canHaveCustomEmojis) {
				const { digits } = formattingSettings;
				result = result
					.toString()
					.split("")
					.map((digit) => (digits[digit] ? digits[digit] : digit))
					.join("");
			}
		}

		return result.toString();
	}

	/**
	 * Removes spaces, dashes and underscore from the name of a counter
	 * @param name
	 * @returns
	 */
	public static safeCounterName(
		name: typeof counters[number]["aliases"][number]
	) {
		return name
			.replace(/-|_|\s/g, "")
			.toLowerCase() as convertCounterNameToSafe<
			typeof counters[number]["aliases"][number]
		>;
	}

	/**
	 * Converts the a counter to the key format used in the cache
	 * @param counterName
	 * @param resource
	 * @param formattingSettingsRaw
	 * @returns
	 */
	private counterToKey(
		counterName: convertCounterNameToSafe<
			typeof counters[number]["aliases"][number]
		>,
		resource: string,
		formattingSettingsRaw: string
	): string {
		return [formattingSettingsRaw, counterName, resource]
			.filter((x) => x) // remove undefined stuff
			.join(":"); // the final thing will look like "base64Settings:counterName:ExtraParamsAkaResource", like a normal counter but without the curly braces {}
	}

	public static getCounterByAlias(
		alias:
			| convertCounterNameToSafe<typeof counters[number]["aliases"][number]>
			| typeof counters[number]["aliases"][number],
		isSafe: boolean
	): Counter<any> {
		for (const counter of this.counters) {
			if (isSafe) {
				if (
					counter.aliases.includes(
						alias as convertCounterNameToSafe<
							typeof counters[number]["aliases"][number]
						>
					)
				)
					return counter;
			} else {
				if (
					counter.aliases.includes(
						this.safeCounterName(
							alias as typeof counters[number]["aliases"][number]
						)
					)
				)
					return counter;
			}
		}
	}
}

export default CountService;
type HasTail<Items extends string[]> = Items extends [any, any, ...any[]]
	? true
	: false;
type Tail<Items extends string[]> = Items extends [string, ...infer Tail]
	? Tail
	: never;
type JoinCounterParts<Parts, Delimiter extends string = ""> = Parts extends [
	any,
	...any[]
]
	? `${Parts[0]}${HasTail<Parts> extends true
			? `${Delimiter}${JoinCounterParts<Tail<Parts>, Delimiter>}`
			: ``}`
	: string[] extends Parts
	? string
	: ``;
type removeCharacter<
	T,
	Delimiter extends string = "-"
> = T extends `${infer first}${Delimiter}${infer last}`
	? [first, ...removeCharacter<last>]
	: [T];
type convertCounterNameToSafe<T> = Lowercase<
	JoinCounterParts<
		removeCharacter<
			JoinCounterParts<
				removeCharacter<JoinCounterParts<removeCharacter<T>>, "_">
			>,
			" "
		>
	>
>;
