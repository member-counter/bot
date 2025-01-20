import { botStatsEvaluator } from "./bot-stats";
import { channelEvaluator } from "./channels";
import { clockEvaluator } from "./clock";
import { concatEvaluator } from "./concat";
import { countdownEvaluator } from "./countdown";
import { gameEvaluator } from "./game";
import { HTTPEvaluator } from "./http";
import { mathEvaluator } from "./Math";
import { membersEvaluator } from "./members";
import { memeratorEvaluator } from "./Memerator";
import { nitroBoostersEvaluator } from "./nitroBoosters";
import { numberEvaluator } from "./number";
import { redditEvaluator } from "./reddit";
import { replaceEvaluator } from "./replace";
import { rolesEvaluator } from "./roles";
import { twitchEvaluator } from "./Twitch";
import { youTubeEvaluator } from "./YouTube";

const dataSourceEvaluators = [
  botStatsEvaluator,
  channelEvaluator,
  clockEvaluator,
  countdownEvaluator,
  gameEvaluator,
  HTTPEvaluator,
  mathEvaluator,
  membersEvaluator,
  memeratorEvaluator,
  nitroBoostersEvaluator,
  numberEvaluator,
  redditEvaluator,
  replaceEvaluator,
  concatEvaluator,
  rolesEvaluator,
  twitchEvaluator,
  youTubeEvaluator,
];

export default dataSourceEvaluators;
