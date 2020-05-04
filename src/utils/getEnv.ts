import dotenv from 'dotenv';
import dotenvParseVariables from 'dotenv-parse-variables';
import { MemberCounterEnv } from '../typings/MemberCounterEnv';

let env = dotenv.config();
const parsedEnv = dotenvParseVariables({ ...process.env });

function getEnv(): MemberCounterEnv {
  return parsedEnv;
}

export default getEnv;
