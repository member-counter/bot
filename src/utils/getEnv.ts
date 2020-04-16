import dotenv from 'dotenv';
import dotenvParseVariables from 'dotenv-parse-variables';
import { MemberCounterEnv } from '../typings/MemberCounterEnv';

const parsedEnv = dotenvParseVariables(dotenv.config().parsed);

function getEnv(): MemberCounterEnv {
  return parsedEnv;
}

export default getEnv;
