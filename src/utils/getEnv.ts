import dotenv from 'dotenv';
import dotenvParseVariables from 'dotenv-parse-variables';

dotenv.config();
const parsedEnv = dotenvParseVariables(process.env);

interface MemberCounterEnv {
  readonly NODE_ENV: 'development' | 'production';
  readonly DEBUG: boolean;
  readonly FOSS_MODE: boolean;
  readonly DISCORD_CLIENT_ID: string;
  readonly DISCORD_CLIENT_TOKEN: string;
  readonly DISCORD_PREFIX: string;
  readonly DISCORD_DEFAULT_LANG: 'en_US' | 'pt_BR' | 'es_ES';
  readonly DISCORD_OFFICIAL_SERVER_ID: string;
  readonly DISCORD_OFFICIAL_SERVER_URL: string;
  readonly REWARD_ROLE_ID: string;
  readonly BOT_OWNERS: string[];
  readonly UPDATE_COUNTER_INTERVAL: number;
  readonly PREMIUM_BOT: boolean;
  readonly PREMIUM_BOT_ID: string;
  readonly PREMIUM_BOT_INVITE: string;
  readonly DB_URI: string;
  readonly WEBSITE_URI: string;
  readonly DONATION_URI: string;

  // Bot stats
  readonly SEND_BOT_STATS: boolean;
  readonly DBL_TOKEN: string;
  readonly DBGG_TOKEN: string;
  readonly DBOATS_TOKEN: string;
  readonly DBWORLD_TOKEN: string;
  readonly BOND_TOKEN: string;
  readonly BFD_TOKEN: string;
}

function getEnv(): MemberCounterEnv {
  return parsedEnv;
}

export default getEnv;
