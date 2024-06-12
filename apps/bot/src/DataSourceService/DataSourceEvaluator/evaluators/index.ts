import { botStatsEvaluator } from "./bot-stats";
import { channelEvaluator } from "./channels";
import { clockEvaluator } from "./clock";
import { countdownEvaluator } from "./countdown";
import { gameEvaluator } from "./game";
import { HTTPEvaluator } from "./http";
import { mathEvaluator } from "./Math";
import { membersDataSourceEvaluator } from "./members";
import { memeratorEvaluator } from "./Memerator";
import { nitroBoostersEvaluator } from "./nitroBoosters";
import { numberEvaluator } from "./number";
import { redditEvaluator } from "./reddit";
import { replaceEvaluator } from "./replace";
import { rolesEvaluator } from "./roles";
import { twitchEvaluator } from "./Twitch";
import { youTubeEvaluator } from "./YouTube";

// TODO test everything
const dataSourceEvaluators = [
  botStatsEvaluator,
  channelEvaluator,
  clockEvaluator,
  countdownEvaluator,
  gameEvaluator,
  HTTPEvaluator,
  mathEvaluator,
  membersDataSourceEvaluator,
  memeratorEvaluator,
  nitroBoostersEvaluator,
  numberEvaluator,
  redditEvaluator,
  replaceEvaluator,
  rolesEvaluator,
  twitchEvaluator,
  youTubeEvaluator,
];

export default dataSourceEvaluators;
