export const DATA_SOURCE_DELIMITER = "\u001F";

export function stringifyDataSoure(
  dataSource: DataSource | DataSourceBase,
): string {
  return `${DATA_SOURCE_DELIMITER}${JSON.stringify(dataSource)}${DATA_SOURCE_DELIMITER}`;
}

export interface DataSourceFormatSettings {
  locale?: string | null;
  compactNotation?: boolean | null;
  digits?: (string | null)[] | null;
}

export type DataSource =
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
  | DataSourceConcat
  | DataSourceRoles
  | DataSourceBotStats
  | DataSourceTwitch
  | DataSourceYoutube
  | DataSourceNumber
  | DataSourceUnknown;

export interface DataSourceBase {
  id: DataSourceId;
  format?: DataSourceFormatSettings;
}

export interface DataSourceMembers extends DataSourceBase {
  id: DataSourceId.MEMBERS;
  options?: {
    statusFilter?: MembersFilterStatus;
    accountTypeFilter?: MembersFilterAccountType;
    playing?: (DataSource | string)[];
    roles?: (DataSource | string)[];
    roleFilterMode?: FilterMode;
    connectedTo?: (DataSource | string)[];
    bannedMembers?: boolean;
  };
}

export interface DataSourceMath extends DataSourceBase {
  id: DataSourceId.MATH;
  options?: {
    operation?: MathDataSourceOperation;
    numbers?: (DataSource | number)[];
  };
}

export interface DataSourceConcat extends DataSourceBase {
  id: DataSourceId.CONCAT;
  options?: {
    strings?: (DataSource | string)[];
  };
}

export interface DataSourceChannels extends DataSourceBase {
  id: DataSourceId.CHANNELS;
  options?: { categories?: (DataSource | string)[] };
}

export interface DataSourceClock extends DataSourceBase {
  id: DataSourceId.CLOCK;
  options?: { timezone?: DataSource | string };
}

export interface DataSourceCountdown extends DataSourceBase {
  id: DataSourceId.COUNTDOWN;
  options?: { date?: DataSource | number; format?: DataSource | string };
}

export interface DataSourceGame extends DataSourceBase {
  id: DataSourceId.GAME;
  options?: {
    address?: DataSource | string;
    port?: DataSource | number;
    game?: DataSource | string;
  };
}

export interface DataSourceHTTP extends DataSourceBase {
  id: DataSourceId.HTTP;
  options?: {
    url?: DataSource | string;
    dataPath?: DataSource | string;
    lifetime?: DataSource | number;
  };
}

export interface DataSourceMemerator extends DataSourceBase {
  id: DataSourceId.MEMERATOR;
  options?: {
    username?: DataSource | string;
    return?: MemeratorDataSourceReturn;
  };
}

export interface DataSourceNitroBoosters extends DataSourceBase {
  id: DataSourceId.NITRO_BOOSTERS;
  options?: never;
}

export interface DataSourceReddit extends DataSourceBase {
  id: DataSourceId.REDDIT;
  options?: {
    subreddit?: DataSource | string;
    return?: RedditDataSourceReturn;
  };
}

export interface DataSourceReplace extends DataSourceBase {
  id: DataSourceId.REPLACE;
  options?: {
    text?: DataSource | string;
    replacements?: ReplaceReplacement[];
  };
}

export interface DataSourceRoles extends DataSourceBase {
  id: DataSourceId.ROLES;
  options?: never;
}

export interface DataSourceBotStats extends DataSourceBase {
  id: DataSourceId.BOT_STATS;
  options?: { return?: BotStatsDataSourceReturn };
}

export interface DataSourceTwitch extends DataSourceBase {
  id: DataSourceId.TWITCH;
  options?: {
    username?: DataSource | string;
    return?: TwitchDataSourceReturn;
  };
}

export interface DataSourceYoutube extends DataSourceBase {
  id: DataSourceId.YOUTUBE;
  options?: {
    channelUrl?: DataSource | string;
    return?: YouTubeDataSourceReturn;
  };
}

export interface DataSourceNumber extends DataSourceBase {
  id: DataSourceId.NUMBER;
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
  CONCAT,
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
  YOUTUBE = 15,
  NUMBER,
  UNKNOWN,
}

export enum MathDataSourceOperation {
  ADD,
  SUBTRACT,
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
  VIEWERS,
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
