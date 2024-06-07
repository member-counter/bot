export const DATA_SOURCE_DELIMITER = "\u001F";

export function stringifyDataSoure(dataSource: DataSource): string {
  return `${DATA_SOURCE_DELIMITER}${JSON.stringify(dataSource)}${DATA_SOURCE_DELIMITER}`;
}

export interface DataSourceFormatSettings {
  locale?: string | null;
  compactNotation?: boolean | null;
  digits?: (string | null)[] | null;
}

export type DataSource =
  | DataSourceBase
  | DataSourceMembers
  | DataSourceMath
  | DataSourceChannels
  | DataSourceClock
  | DataSourceCountdown
  | DataSourceGame
  | DataSourceHTTP
  | DataSourceMemerator
  | DataSourceNitroBoosters
  | DataSourceReddit
  | DataSourceReplace
  | DataSourceRoles
  | DataSourceBotStats
  | DataSourceTwitch
  | DataSourceTwitter
  | DataSourceYoutube
  | DataSourceNumber
  | DataSourceUnknown;

export interface DataSourceBase {
  id: DataSourceId;
  format?: DataSourceFormatSettings;
  options?: Record<string, unknown>;
}

export interface DataSourceMembers extends DataSourceBase {
  id: DataSourceId.MEMBERS;
  format?: DataSourceFormatSettings;
  options?: {
    statusFilter?: MembersFilterStatus;
    accountTypeFilter?: MembersFilterAccountType;
    playing?: (DataSource | string)[];
    roles?: (DataSource | string)[];
    roleFilterMode?: FilterMode;
    bannedMembers?: boolean;
  };
}

export interface DataSourceMath extends DataSourceBase {
  id: DataSourceId.MATH;
  format?: DataSourceFormatSettings;
  options?: {
    operation?: MathDataSourceOperation;
    numbers?: (DataSource | number)[];
  };
}

export interface DataSourceChannels extends DataSourceBase {
  id: DataSourceId.CHANNELS;
  format?: DataSourceFormatSettings;
  options?: { categories?: (DataSource | string)[] };
}

export interface DataSourceClock extends DataSourceBase {
  id: DataSourceId.CLOCK;
  format?: DataSourceFormatSettings;
  options?: { timezone?: DataSource | string };
}

export interface DataSourceCountdown extends DataSourceBase {
  id: DataSourceId.COUNTDOWN;
  format?: DataSourceFormatSettings;
  options?: { date?: DataSource | number; format?: DataSource | string };
}

export interface DataSourceGame extends DataSourceBase {
  id: DataSourceId.GAME;
  format?: DataSourceFormatSettings;
  options?: {
    address?: DataSource | string;
    port?: DataSource | number;
    game?: DataSource | string;
  };
}

export interface DataSourceHTTP extends DataSourceBase {
  id: DataSourceId.HTTP;
  format?: DataSourceFormatSettings;
  options?: {
    url?: DataSource | string;
    dataPath?: DataSource | string;
    lifetime?: DataSource | number;
  };
}

export interface DataSourceMemerator extends DataSourceBase {
  id: DataSourceId.MEMERATOR;
  format?: DataSourceFormatSettings;
  options?: {
    username?: DataSource | string;
    return?: MemeratorDataSourceReturn;
  };
}

export interface DataSourceNitroBoosters extends DataSourceBase {
  id: DataSourceId.NITRO_BOOSTERS;
  format?: DataSourceFormatSettings;
  options?: never;
}

export interface DataSourceReddit extends DataSourceBase {
  id: DataSourceId.REDDIT;
  format?: DataSourceFormatSettings;
  options?: {
    subreddit?: DataSource | string;
    return?: RedditDataSourceReturn;
  };
}

export interface DataSourceReplace extends DataSourceBase {
  id: DataSourceId.REPLACE;
  format?: DataSourceFormatSettings;
  options?: {
    text?: DataSource | string;
    replacements?: ReplaceReplacement[];
  };
}

export interface DataSourceRoles extends DataSourceBase {
  id: DataSourceId.ROLES;
  format?: DataSourceFormatSettings;
  options?: never;
}

export interface DataSourceBotStats extends DataSourceBase {
  id: DataSourceId.BOT_STATS;
  format?: DataSourceFormatSettings;
  options?: { return?: BotStatsDataSourceReturn };
}

export interface DataSourceTwitch extends DataSourceBase {
  id: DataSourceId.TWITCH;
  format?: DataSourceFormatSettings;
  options?: {
    username?: DataSource | string;
    return?: TwitchDataSourceReturn;
  };
}

export interface DataSourceTwitter extends DataSourceBase {
  id: DataSourceId.TWITTER;
  format?: DataSourceFormatSettings;
  options?: { username?: DataSource | string };
}

export interface DataSourceYoutube extends DataSourceBase {
  id: DataSourceId.YOUTUBE;
  format?: DataSourceFormatSettings;
  options?: {
    channelUrl?: DataSource | string;
    return?: YouTubeDataSourceReturn;
  };
}

export interface DataSourceNumber extends DataSourceBase {
  id: DataSourceId.NUMBER;
  format?: DataSourceFormatSettings;
  options?: { number?: DataSource | string };
}

export interface DataSourceUnknown extends DataSourceBase {
  id: DataSourceId.UNKNOWN;
  format?: never;
  options?: never;
}

export enum DataSourceId {
  MEMBERS,
  MATH,
  CHANNELS,
  CLOCK,
  COUNTDOWN,
  GAME,
  HTTP,
  MEMERATOR,
  NITRO_BOOSTERS,
  REDDIT,
  REPLACE,
  ROLES,
  BOT_STATS,
  TWITCH,
  TWITTER,
  YOUTUBE,
  NUMBER,
  UNKNOWN,
}

export enum MathDataSourceOperation {
  ADD,
  SUBSTRACT,
  MULTIPLY,
  DIVIDE,
  MODULO,
}

export enum YouTubeDataSourceReturn {
  SUBSCRIBERS,
  VIEWS,
  VIDEOS,
  CHANNEL_NAME,
}

export enum TwitchDataSourceReturn {
  FOLLOWERS,
  VIEWS,
  CHANNEL_NAME,
}

export enum BotStatsDataSourceReturn {
  USERS,
  GUILDS,
}

export enum RedditDataSourceReturn {
  MEMBERS,
  MEMBERS_ONLINE,
  TITLE,
}

export enum MemeratorDataSourceReturn {
  MEMES,
  FOLLOWERS,
}

export enum FilterMode {
  OR,
  AND,
}

export enum MembersFilterStatus {
  ANY,
  ONLINE,
  IDLE,
  DND,
  OFFLINE,
}

export enum MembersFilterAccountType {
  ANY,
  USER,
  BOT,
}

export interface ReplaceReplacement {
  search?: DataSource | string;
  replacement?: DataSource | string;
}
