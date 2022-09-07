import Eris from "eris";
import GuildService from "./GuildService";
import { loadLanguagePack } from "../utils/languagePack";
import getEnv from "../utils/getEnv";
import botHasPermsToEdit from "../utils/botHasPermsToEdit";
import Constants from "../utils/Constants";
import Counter from "../typings/Counter";
import FormattingSettings from "../typings/FormattingSettings";
import counters from "../counters/all";
import { Bot, ErisClient } from "../bot";
import LanguagePack from "../typings/LanguagePack";

const { UNRESTRICTED_MODE, PREMIUM_BOT, DEBUG, GHOST_MODE } = getEnv();
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
	private client: ErisClient;
	public guild: Eris.Guild;
	private guildSettings: GuildService;
	private languagePack: LanguagePack;
	private localCache: Map<string, string | number>;

	private constructor(guild: Eris.Guild, guildSettings: GuildService) {
		this.guild = guild;
		this.guildSettings = guildSettings;
		this.languagePack = loadLanguagePack(this.guildSettings.language);
		this.localCache = new Map();
		this.client = Bot.client;
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

		for (const [id, rawContent] of counters) {
			try {
				const discordChannel = channels.get(id);

				if (!discordChannel) {
					await this.guildSettings.deleteCounter(id);
					continue;
				}

				const counterIsNameType =
					discordChannel.type === Eris.Constants.ChannelTypes.GUILD_VOICE ||
					discordChannel.type === Eris.Constants.ChannelTypes.GUILD_CATEGORY;

				const counterIsTopicType =
					discordChannel.type === Eris.Constants.ChannelTypes.GUILD_TEXT ||
					discordChannel.type === Eris.Constants.ChannelTypes.GUILD_NEWS;

				const processedContent = await this.processContent(
					rawContent,
					counterIsTopicType
				);

				if (counterIsTopicType) {
					const topicToSet = processedContent.slice(0, 1023);
					if (
						botHasPermsToEdit(discordChannel) &&
						(discordChannel as Eris.TextChannel).topic !== topicToSet
					) {
						if (GHOST_MODE) return;
						await discordChannel.edit({ topic: topicToSet });
					}
				} else if (counterIsNameType) {
					const nameToSet =
						processedContent.length > 2
							? processedContent.slice(0, 99)
							: this.languagePack.functions.getCounts.invalidChannelLength;
					if (
						botHasPermsToEdit(discordChannel) &&
						discordChannel.name !== nameToSet
					) {
						if (GHOST_MODE) return;
						await discordChannel.edit({ name: nameToSet });
					}
				}
			} catch (err) {
				console.error(err);
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
						if (DEBUG) console.error(error);
						this.guildSettings
							.log(`{${counterRequested}}: ${error}`)
							.catch(console.error);
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
					if (returnedValue.hasOwnProperty(key)) {
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

			case Constants.CounterResult.NOT_AVAILABLE:
				result = this.languagePack.functions.getCounts.notAvailable;
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
