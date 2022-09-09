export const Colors = {
	RED: 0xed4245,
	GREEN: 0x57f287,
	YELLOW: 0xfee75c,
	BLURPLE: 0x5865f2,
	FUCHSIA: 0xeb459e,
	WHITE: 0xffffff,
	BLACK: 0x000000
} as const;

export const TranslationPlaceholders = {
	LANG_CODE: {},
	LANG_NAME: {},
	INTERACTION_COMMAND_HANDLER_ERROR_TITLE: {},
	INTERACTION_COMMAND_HANDLER_ERROR_DESCRIPTION: { SUPPORT_SERVER_INVITE: "" },
	INTERACTION_COMMAND_HANDLER_ERROR_FOOTER: { ERROR_ID: "" },
	COMMAND_INVITE_DESCRIPTION: { INVITE_URL: "" },
	COMMAND_INVITE_ADD_TO_SERVER: {},
	COMMAND_INVITE_ADD_TO_SERVER_AGAIN: {},
	COMMAND_INVITE_JOIN_SUPPORT_SERVER: {},
	COMMAND_SETTINGS_SEE_TITLE: { SERVER_NAME: "", SERVER_ID: "" },
	COMMAND_SETTINGS_SEE_LANGUAGE: {},
	COMMAND_SETTINGS_SEE_LANGUAGE_DEFAULT_VALUE: { CURRENT_LANGUAGE: "" },
	COMMAND_SETTINGS_SEE_SHORT_NUMBER: {},
	COMMAND_SETTINGS_SEE_SHORT_NUMBER_DEFAULT_VALUE: { CURRENT_SHORT_NUMBER: "" },
	COMMAND_SETTINGS_CLASSIC_PREMIUM_UPGRADE_SUCCESS: {},
	COMMAND_SETTINGS_CLASSIC_PREMIUM_UPGRADE_ERROR_CANNOT_UPGRADE: {},
	COMMAND_SETTINGS_CLASSIC_PREMIUM_UPGRADE_NO_SERVER_UPGRADES_AVAILABLE: {},
	COMMAND_SETTINGS_LOGS_GUILD_LOGS_TEXT: { SERVER_NAME: "", SERVER_ID: "" },
	COMMAND_SETTINGS_LOGS_NO_LOGS: { SERVER_NAME: "", SERVER_ID: "" },
	COMMAND_SETTINGS_SET_NO_CHANGES_MADE: {},
	COMMAND_SETTINGS_SET_CHANGES_MADE: {},
	COMMAND_SETTINGS_BUTTON_DELETE_ALL: {},
	BUTTON_RESET_SETTINGS_CONFIRM: {},
	BUTTON_RESET_SETTINGS_DONE: {},
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
	TranslationPlaceholders
};

export default Constants;
