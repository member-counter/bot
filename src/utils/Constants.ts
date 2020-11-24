enum UserBadges {
	DONATOR = 1,
	SPONSOR = 1 << 1,
	BETA_TESTER = 1 << 2,
	TRANSLATOR = 1 << 3,
	CONTRIBUTOR = 1 << 4,
	BIG_BRAIN = 1 << 5,
	BUG_CATCHER = 1 << 6,
	PATPAT = 1 << 7,
	FOLDING_AT_HOME = 1 << 8,
}

enum CounterResult {
	PREMIUM = -1,
	ERROR = -2,
	UNKNOWN = -3,
	DISABLED = -4,
}

const Constants = {
	CounterResult,
	UserBadges,
};

export default Constants;
export { Constants, UserBadges };