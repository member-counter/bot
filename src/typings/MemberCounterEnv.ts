import AvailableLanguages from './AvailableLanguages';

export interface MemberCounterEnv {
  readonly NODE_ENV: 'development' | 'production';
  readonly DEBUG: boolean;
  readonly FOSS_MODE: boolean;
  readonly DISCORD_CLIENT_ID: string;
  readonly DISCORD_CLIENT_TOKEN: string;
  readonly DISCORD_PREFIX: string;
  readonly DISCORD_DEFAULT_LANG: AvailableLanguages;
  readonly DISCORD_BOT_INVITE: string;
  readonly DISCORD_OFFICIAL_SERVER_ID: string;
  readonly DISCORD_OFFICIAL_SERVER_URL: string;
  readonly BOT_OWNERS: string[];
  readonly UPDATE_COUNTER_INTERVAL: number;
  readonly PREMIUM_BOT: boolean;
  readonly PREMIUM_BOT_ID: string;
  readonly PREMIUM_BOT_INVITE: string;
  readonly DB_URI: string;
  readonly WEBSITE_URL: string;
  readonly DONATION_URL: string;

  // Bot stats
  readonly SEND_BOT_STATS: boolean;
  readonly DBL_TOKEN: string;
  readonly DBGG_TOKEN: string;
  readonly DBOATS_TOKEN: string;
  readonly DBWORLD_TOKEN: string;
  readonly BOND_TOKEN: string;
  readonly BFD_TOKEN: string;
}
