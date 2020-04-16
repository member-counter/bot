import dotenv from 'dotenv';
import dotenvParseVariables from 'dotenv-parse-variables';
import { MemberCounterEnv } from '../typings/MemberCounterEnv';

const parsedEnv = dotenvParseVariables(dotenv.config().parsed);

function getEnv(): MemberCounterEnv {
  console.log(parsedEnv);
  return parsedEnv;
}

export default getEnv;
