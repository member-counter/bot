import dotenv from 'dotenv';
import dotenvParseVariables from 'dotenv-parse-variables';
import { MemberCounterEnv } from '../typings/MemberCounterEnv';

let env = dotenv.config();
if (env.error) throw env.error;
const parsedEnv = dotenvParseVariables(env.parsed);

function getEnv(): MemberCounterEnv {
  return parsedEnv;
}

export default getEnv;
