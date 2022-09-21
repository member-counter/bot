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

export const Constants = {
	Colors,
	CounterResult,
	UserBadges,
	emojiBadges
};

export default Constants;
