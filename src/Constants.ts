/* eslint-disable @typescript-eslint/ban-ts-comment */
import { GatewayIntentsString, GatewayDispatchEvents } from "discord.js";

export const Colors = {
	RED: 0xed4245,
	GREEN: 0x57f287,
	YELLOW: 0xfee75c,
	BLURPLE: 0x5865f2,
	FUCHSIA: 0xeb459e,
	WHITE: 0xffffff,
	BLACK: 0x000000
};

type IntentsEventMap = {
	[key in GatewayIntentsString]: `${GatewayDispatchEvents}`[];
};

export const IntentsEventMap: IntentsEventMap = {
	Guilds: [
		"GUILD_CREATE",
		"GUILD_UPDATE",
		"GUILD_DELETE",
		"GUILD_ROLE_CREATE",
		"GUILD_ROLE_UPDATE",
		"GUILD_ROLE_DELETE",
		"CHANNEL_CREATE",
		"CHANNEL_UPDATE",
		"CHANNEL_DELETE",
		"CHANNEL_PINS_UPDATE",
		"THREAD_CREATE",
		"THREAD_UPDATE",
		"THREAD_DELETE",
		"THREAD_MEMBER_UPDATE",
		"STAGE_INSTANCE_CREATE",
		"STAGE_INSTANCE_UPDATE",
		"STAGE_INSTANCE_DELETE"
	],
	GuildMembers: [
		"GUILD_MEMBER_ADD",
		"GUILD_MEMBER_UPDATE",
		"GUILD_MEMBER_REMOVE",
		"THREAD_MEMBERS_UPDATE"
	],
	GuildBans: ["GUILD_BAN_ADD", "GUILD_BAN_REMOVE"],
	GuildEmojisAndStickers: ["GUILD_EMOJIS_UPDATE", "GUILD_STICKERS_UPDATE"],
	GuildIntegrations: [
		"GUILD_INTEGRATIONS_UPDATE"
		// These aren't supposed to be sent to bots
		// "INTEGRATION_CREATE",
		// "INTEGRATION_UPDATE",
		// "INTEGRATION_DELETE"
	],
	GuildWebhooks: ["WEBHOOKS_UPDATE"],
	GuildInvites: ["INVITE_CREATE", "INVITE_DELETE"],
	GuildVoiceStates: ["VOICE_STATE_UPDATE"],
	GuildPresences: ["PRESENCE_UPDATE"],
	GuildMessages: [
		"MESSAGE_CREATE",
		"MESSAGE_UPDATE",
		"MESSAGE_DELETE",
		"MESSAGE_DELETE_BULK"
	],
	GuildMessageReactions: [
		"MESSAGE_REACTION_ADD",
		"MESSAGE_REACTION_REMOVE",
		"MESSAGE_REACTION_REMOVE_ALL",
		"MESSAGE_REACTION_REMOVE_EMOJI"
	],
	GuildMessageTyping: ["TYPING_START"],
	DirectMessages: [
		"MESSAGE_CREATE",
		"MESSAGE_UPDATE",
		"MESSAGE_DELETE",
		"CHANNEL_PINS_UPDATE"
	],
	DirectMessageReactions: [
		"MESSAGE_REACTION_ADD",
		"MESSAGE_REACTION_REMOVE",
		"MESSAGE_REACTION_REMOVE_ALL",
		"MESSAGE_REACTION_REMOVE_EMOJI"
	],
	DirectMessageTyping: ["TYPING_START"],
	// TODO remove these ts-ignores when GatewayDispatchEvents is updated
	GuildScheduledEvents: [
		//@ts-ignore
		"GUILD_SCHEDULED_EVENT_CREATE",
		//@ts-ignore
		"GUILD_SCHEDULED_EVENT_UPDATE",
		//@ts-ignore
		"GUILD_SCHEDULED_EVENT_DELETE",
		//@ts-ignore
		"GUILD_SCHEDULED_EVENT_USER_ADD",
		//@ts-ignore
		"GUILD_SCHEDULED_EVENT_USER_REMOVE"
	],
	MessageContent: []
};

export const TranslationPlaceholders = {
	LANG_CODE: {},
	LANG_NAME: {},
	INTERACTION_COMMAND_HANDLER_ERROR_TITLE: {},
	INTERACTION_COMMAND_HANDLER_ERROR_DESCRIPTION: { SUPPORT_SERVER_INVITE: "" },
	INTERACTION_COMMAND_HANDLER_ERROR_FOOTER: { ERROR_ID: "" },
	COMMAND_INVITE_DESCRIPTION: { INVITE_URL: "" },
	COMMAND_INVITE_ADD_TO_SERVER: {},
	COMMAND_INVITE_ADD_TO_SERVER_AGAIN: {},
	COMMAND_SETTINGS_SEE_TITLE: { SERVER_NAME: "", SERVER_ID: "" },
	COMMAND_SETTINGS_SEE_LANGUAGE: {},
	COMMAND_SETTINGS_SEE_LANGUAGE_DEFAULT_VALUE: { CURRENT_LANGUAGE: "" },
	COMMAND_SETTINGS_SET_NO_CHANGES_MADE: {},
	COMMAND_SETTINGS_SET_CHANGES_MADE: {},
	COMMAND_SETTINGS_BUTTON_DELETE_ALL: {},
	BUTTON_DELETE_SETTINGS_CONFIRM: {},
	BUTTON_DELETE_SETTINGS_DONE: {},
	COMMON_ERROR_NO_PERMISSIONS: {},
	COMMON_ERROR_NO_DM: {},
	COMMON_ACCEPT: {},
	COMMON_CANCEL: {},
	COMMON_YES: {},
	COMMON_NO: {},
	SERVICE_GUILD_SETTINGS_INVALID_LOCALE: {},
	AUTOCOMPLETE_DEFAULT_SERVER_LOCALE: {}
};

export type Translations = keyof typeof TranslationPlaceholders;

export const Constants = {
	Colors,
	IntentsEventMap,
	TranslationPlaceholders
};

export default Constants;
