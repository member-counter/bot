import dotenv from "dotenv";
import Bourne from "@hapi/bourne";
import JoiBase from "joi";
import path from "path";

// Parse arrays and objects
const Joi: typeof JoiBase = JoiBase.extend(
	{
		type: "object",
		base: JoiBase.object(),
		coerce: {
			from: "string",
			method(value) {
				if (value[0] !== "{" && !/^\s*\{/.test(value)) {
					return;
				}
				try {
					return { value: Bourne.parse(value) };
				} catch (ignoreErr) {}
			}
		}
	},
	{
		type: "array",
		base: JoiBase.array(),
		coerce: {
			from: "string",
			method(value) {
				if (
					typeof value !== "string" ||
					(value[0] !== "[" && !/^\s*\[/.test(value))
				) {
					return;
				}
				try {
					return { value: Bourne.parse(value) };
				} catch (ignoreErr) {}
			}
		}
	}
);

dotenv.config({ path: path.join(__dirname, "../.env") });

const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string()
			.allow("production", "development")
			.default("production"),
		DEBUG: Joi.boolean().optional().default(false),
		UNRESTRICTED_MODE: Joi.boolean().optional().default(false),
		GHOST_MODE: Joi.boolean().optional().default(false),
		DISCORD_BOT_TOKEN: Joi.string().required().description("The bot token"),
		DISCORD_BOT_SHARDS: Joi.alternatives()
			.try(
				Joi.number(),
				Joi.array().items(Joi.number()).min(1),
				Joi.string().valid("auto")
			)
			.default("auto"),
		DISCORD_BOT_SHARDS_COUNT: Joi.number().default(1),
		DISCORD_BOT_AUTO_DEPLOY_COMMANDS: Joi.boolean()
			.default(false)
			.description(
				"Deploy slash commands automatically when the bot is started"
			),
		DISCORD_OFFICIAL_SERVER_ID: Joi.string().optional(),
		DISCORD_OFFICIAL_SERVER_URL: Joi.string().uri().allow("").optional(),
		PREMIUM_BOT_ID: Joi.string().allow("").optional(),
		PREMIUM_BOT_INVITE: Joi.string().uri().allow("").optional(),
		PREMIUM_BOT: Joi.boolean().optional(),
		DB_URI: Joi.string().required().description("MongoDB connection URI"),
		TEST_DEPLOY_INTERACTION_COMMAND_GUILD_ID: Joi.string().description(
			"Guild ID to deploy commands quickly for testing purposes"
		),
		I18N_PROVIDER: Joi.string().required().valid("local", "redis"),
		I18N_DEFAULT_LOCALE: Joi.string().required(),
		REDIS_HOST: Joi.string().required().description("Redis host address"),
		REDIS_PORT: Joi.number().required().description("Redis host port"),
		REDIS_PASSWORD: Joi.string().required().description("Redis password"),
		LOGS_SAVE: Joi.bool().default(false),
		LOGS_SHOW_DATE: Joi.bool().default(false),
		USE_CUSTOM_EMOJIS: Joi.boolean().optional().default(false),
		CUSTOM_EMOJI_LOADING: Joi.string().optional(),
		CUSTOM_EMOJI_CHECK_MARK: Joi.string().optional(),
		CUSTOM_EMOJI_ERROR: Joi.string().optional(),
		CUSTOM_EMOJI_CONFIRM: Joi.string().optional(),
		CUSTOM_EMOJI_NEGATIVE: Joi.string().optional(),
		CUSTOM_EMOJI_WARNING: Joi.string().optional()
	})
	.unknown();

const { value: envVars, error } = envVarsSchema
	.prefs({ errors: { label: "key" } })
	.validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

const config = {
	env: envVars.NODE_ENV as string,
	discord: {
		bot: {
			token: envVars.DISCORD_BOT_TOKEN as string,
			shards: envVars.DISCORD_BOT_SHARDS as number | number[] | "auto",
			shardCount: envVars.DISCORD_BOT_SHARDS_COUNT as number,
			officialBotId: envVars.DISCORD_OFFICIAL_BOT_ID as string
		},
		supportServer: { url: envVars.DISCORD_OFFICIAL_SERVER_URL as string },
		autoDeployCommands: envVars.DISCORD_BOT_AUTO_DEPLOY_COMMANDS as boolean
	},
	db: { uri: envVars.DB_URI as string },
	test: {
		deployInteractionCommandGuildId:
			envVars.TEST_DEPLOY_INTERACTION_COMMAND_GUILD_ID as string
	},
	i18n: {
		provider: envVars.I18N_PROVIDER as string,
		defaultLocale: envVars.I18N_DEFAULT_LOCALE as string
	},
	redis: {
		host: envVars.REDIS_HOST as string,
		port: envVars.REDIS_PORT as number,
		password: envVars.REDIS_PASSWORD as string
	},
	logs: {
		save: envVars.LOGS_SAVE as boolean,
		showDate: envVars.LOGS_SHOW_DATE as boolean
	},
	premium: {
		thisBotsIsPremium: envVars.PREMIUM_BOT as boolean,
		premiumBotId: envVars.PREMIUM_BOT_ID as string
	},
	customEmojis: {
		useCustomEmojis: envVars.USE_CUSTOM_EMOJIS as boolean,
		checkMark: envVars.CUSTOM_EMOJI_CHECK_MARK as string,
		error: envVars.CUSTOM_EMOJI_ERROR as string,
		confirm: envVars.CUSTOM_EMOJI_CONFIRM as string,
		negative: envVars.CUSTOM_EMOJI_NEGATIVE as string,
		warning: envVars.CUSTOM_EMOJI_WARNING as string,
		loading: envVars.CUSTOM_EMOJI_LOADING as string
	},
	ghostMode: envVars.GHOST_MODE as boolean,
	unrestrictedMode: envVars.UNRESTRICTED_MODE as boolean,
	debug: envVars.DEBUG as boolean
};

export default config;
