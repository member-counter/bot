import Job from "../typings/Job";

import checkPremiumGuilds from "./checkPremiumGuilds";
import checkBlockedGuilds from "./checkBlockedGuilds";
import clearCountCache from "./clearCountCache";
import freeMemory from "./freeMemory";
import postBotStatus from "./postBotStats";
import setBotStatus from "./setBotSatus";
import updateCounters from "./updateCounters";
import fetchMemberCounts from "./fetchMemberCounts";

const jobs: Job[] = [
	checkBlockedGuilds,
	checkPremiumGuilds,
	clearCountCache,
	freeMemory,
	setBotStatus,
	postBotStatus,
	updateCounters,
	fetchMemberCounts
];

export default jobs;
