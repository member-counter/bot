export const Colors = {
	RED: 0xed4245,
	GREEN: 0x57f287,
	YELLOW: 0xfee75c,
	BLURPLE: 0x5865f2,
	FUCHSIA: 0xeb459e,
	WHITE: 0xffffff,
	BLACK: 0x000000
} as const;
enum UserBadges {
	DONOR = 1,
	PREMIUM = 1 << 1,
	BETA_TESTER = 1 << 2,
	TRANSLATOR = 1 << 3,
	CONTRIBUTOR = 1 << 4,
	BIG_BRAIN = 1 << 5,
	BUG_CATCHER = 1 << 6,
	PATPAT = 1 << 7,
	FOLDING_AT_HOME = 1 << 8
}

enum CounterResult {
	PREMIUM = -1,
	ERROR = -2,
	UNKNOWN = -3,
	DISABLED = -4,
	NOT_AVAILABLE = -5
}

export const Constants = {
	Colors,
	CounterResult,
	UserBadges
};
export { UserBadges };

export default Constants;
