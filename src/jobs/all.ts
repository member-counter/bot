import Job from "../typings/Job";

import checkPremiumGuilds from "./checkPremiumGuilds";
import checkBlockedGuilds from "./checkBlockedGuilds";
import clearCountCache from "./clearCountCache";
import freeRam from "./freeRam";
import postBotStatus from "./postBotStats";
import setBotStatus from './setBotSatus';
import updateCounters from "./updateCounters";


const jobs: Job[] = [
  checkBlockedGuilds,
  checkPremiumGuilds,
  clearCountCache,
  freeRam,
  setBotStatus,
  postBotStatus,
  updateCounters,
];


export default jobs;