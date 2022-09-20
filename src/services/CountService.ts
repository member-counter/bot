/* eslint-disable prefer-destructuring */
import { ChannelType } from "discord-api-types/v10";
import {
	Client,
	CommandInteraction,
	Guild,
	Interaction,
	TextChannel
} from "discord.js";

import config from "../config";
import Constants from "../Constants";
import logger from "../logger";
import { i18nInstanceType, i18nService } from "../services/i18n";
import Counter from "../typings/Counter";
import FormattingSettings from "../typings/FormattingSettings";
import { botHasPermsToEdit } from "../utils";
import GuildService from "./GuildSettings";

// TODO: Uncomment when counters get implemented and remove temp fix
// import counters from "../counters/all";
const counters: Counter[] = [];
const {
	debug: DEBUG,
	ghostMode,
	premium: { thisBotsIsPremium: PREMIUM_BOT },
	unrestrictedMode: UNRESTRICTED_MODE
} = config;
class CountService {
	private static counters = counters.map((counter) => {
		counter.aliases = counter.aliases.map((alias) =>
			CountService.safeCounterName(alias)
		);
		return counter;
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
		interaction: Interaction | CommandInteraction
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
			.map((section) => section.replace("\\:", ":"));
		let formattingSettingsRaw: string;
		const formattingSettings: FormattingSettings = (() => {
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
			const counter = CountService.getCounterByAlias(counterName);

			if (!counter) {
				result = Constants.CounterResult.UNKNOWN;
			} else if (!counter.isEnabled) {
				result = Constants.CounterResult.DISABLED;
			} else if (counter.isPremium && !(PREMIUM_BOT || UNRESTRICTED_MODE)) {
				result = Constants.CounterResult.PREMIUM;
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
					});

				if (
					typeof returnedValue === "string" ||
					typeof returnedValue === "number"
				) {
					returnedValue = {
						[counterName]: returnedValue
					};
				} else if (typeof returnedValue === "undefined") {
					returnedValue = {
						[counterName]: Constants.CounterResult.ERROR
					};
				}

				for (const key in returnedValue) {
					if (Object.prototype.hasOwnProperty.call(returnedValue, key)) {
						const extKey = CountService.safeCounterName(key);
						let extValue = returnedValue[key];

						if (typeof extValue === "string") {
							// nothing, just don't convert it to an error
						} else if (typeof extValue === "number") {
							if (isNaN(extValue)) extValue = Constants.CounterResult.ERROR;
						} else {
							extValue = Constants.CounterResult.ERROR;
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
		}
		// format result if it's a number according to the formatting settings
		if (typeof result === "number" && !isNaN(result)) {
			const isShortNumberEnabled = formattingSettings.shortNumber > -1;
			const isLocaleEnabled = !formattingSettings.locale.includes("disable");
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
	public static safeCounterName(name: string) {
		return name.replace(/-|_|\s/g, "").toLowerCase();
	}

	/**
	 * Converts the a counter to the key format used in the cache
	 * @param counterName
	 * @param resource
	 * @param formattingSettingsRaw
	 * @returns
	 */
	private counterToKey(
		counterName: string,
		resource: string,
		formattingSettingsRaw: string
	): string {
		return [
			formattingSettingsRaw,
			CountService.safeCounterName(counterName),
			resource
		]
			.filter((x) => x) // remove undefined stuff
			.join(":"); // the final thing will look like "base64Settings:counterName:ExtraParamsAkaResource", like a normal counter but without the curly braces {}
	}

	public static getCounterByAlias(alias: string): Counter {
		for (const counter of this.counters) {
			if (counter.aliases.includes(this.safeCounterName(alias))) return counter;
		}
	}
}

export default CountService;
