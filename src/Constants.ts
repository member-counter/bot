export const Colors = {
	RED: 0xed4245,
	GREEN: 0x57f287,
	YELLOW: 0xfee75c,
	BLURPLE: 0x5865f2,
	FUCHSIA: 0xeb459e,
	WHITE: 0xffffff,
	BLACK: 0x000000
} as const;

export enum UserBadges {
	DONOR = 1,
	PREMIUM = 2,
	BETA_TESTER = 4,
	TRANSLATOR = 8,
	CONTRIBUTOR = 16,
	BIG_BRAIN = 32,
	BUG_CATCHER = 64,
	PATPAT = 128,
	FOLDING_AT_HOME = 256
}

export const emojiBadges = {
	[UserBadges.DONOR]: "❤️",
	[UserBadges.PREMIUM]: "💎",
	[UserBadges.BETA_TESTER]: "🧪",
	[UserBadges.TRANSLATOR]: "🌎",
	[UserBadges.CONTRIBUTOR]: "💻",
	[UserBadges.BIG_BRAIN]: "🧠",
	[UserBadges.BUG_CATCHER]: "🐛",
	[UserBadges.PATPAT]: "🐱",
	[UserBadges.FOLDING_AT_HOME]: "🧬",
	["❤️"]: UserBadges.DONOR,
	["💎"]: UserBadges.PREMIUM,
	["🧪"]: UserBadges.BETA_TESTER,
	["🌎"]: UserBadges.TRANSLATOR,
	["💻"]: UserBadges.CONTRIBUTOR,
	["🧠"]: UserBadges.BIG_BRAIN,
	["🐛"]: UserBadges.BUG_CATCHER,
	["🐱"]: UserBadges.PATPAT,
	["🧬"]: UserBadges.FOLDING_AT_HOME
} as const;
export enum CounterResult {
	PREMIUM = -1,
	ERROR = -2,
	UNKNOWN = -3,
	DISABLED = -4,
	NOT_AVAILABLE = -5
}
export const ButtonIds = {
	resetGuildSettings: "reset_guild_settings",
	profileActions: {
		grantServerUpgrade: "grant_server_upgrade",
		grantCredits: "grant_credits",
		grantBadge: "grant_badge",
		revokeBadge: "revoke_badge"
	},
	deleteUserProfile: "delete_user_profile"
} as const;
export const ModalIds = {
	// TODO: Add guild settings reset modal to settings command
	resetGuildSettings: "reset_guild_settings_modal",
	profileActions: {
		grantServerUpgrade: "grant_server_upgrade_modal",
		grantCredits: "grant_credits_modal",
		grantBadge: "grant_badge_modal",
		revokeBadge: "revoke_badge_modal"
	},
	deleteUserProfile: "delete_user_profile_modal"
} as const;
export const TextInputIds = {
	resetGuildSettings: "reset_guild_settings_modal",
	profileActions: {
		grantServerUpgrade: "grant_server_upgrade_amount",
		grantCredits: "grant_credits_amount",
		grantBadge: "grant_badge_input",
		revokeBadge: "revoke_badge_input"
	},
	deleteUserProfile: "delete_user_profile_confirmation_text"
} as const;

export const Constants = {
	Colors,
	CounterResult,
	UserBadges,
	emojiBadges,
	TextInputIds,
	ModalIds,
	ButtonIds
};

export default Constants;
