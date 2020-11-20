import Job from "../typings/Job";

import freeRam from "./freeRam";
import postBotStatus from "./postBotStats";
import setBotStatus from './setBotSatus';
import updateCounters from "./updateCounters";
import checkBlockedGuilds from "./checkBlockedGuilds";
import checkPremiumGuilds from "./checkPremiumGuilds";


const jobs: Job[] = [
  freeRam,
  setBotStatus,
  postBotStatus,
  updateCounters,
  checkBlockedGuilds,
  checkPremiumGuilds,
];


export default jobs;