import { channelEvaluator } from "./channels";
import { clockEvaluator } from "./clock";
import { countdownEvaluator } from "./countdown";
import { mathEvaluator } from "./Math";
import { membersDataSourceEvaluator } from "./members";
import { memeratorEvaluator } from "./Memerator";
import { nitroBoostersEvaluator } from "./nitroBoosters";
import { numberEvaluator } from "./number";
import { redditEvaluator } from "./reddit";
import { replaceEvaluator } from "./replace";
import { rolesEvaluator } from "./roles";

const dataSourceEvaluators = [
  channelEvaluator,
  clockEvaluator,
  countdownEvaluator,
  mathEvaluator,
  membersDataSourceEvaluator,
  memeratorEvaluator,
  nitroBoostersEvaluator,
  numberEvaluator,
  redditEvaluator,
  replaceEvaluator,
  rolesEvaluator,
];

export default dataSourceEvaluators;
