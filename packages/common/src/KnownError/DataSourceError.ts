export const DataSourceErrorNames = [
  "UNKNOWN",
  "UNKNOWN_DATA_SOURCE",
  "UNKNOWN_EVALUATION_RETURN_TYPE",
  "FAILED_TO_RETURN_A_FINAL_STRING",
  "DELIMITED_DATA_SOURCE_IS_ILLEGAL_JSON",
  "DELIMITED_DATA_SOURCE_IS_INVALID",
  "EVALUATION_RESULT_FOR_CHANNEL_NAME_IS_LESS_THAN_2_CHARACTERS",
  "NO_ENOUGH_PERMISSIONS_TO_EDIT_CHANNEL",
  "MEMERATOR_MISSING_USERNAME",
  "REDDIT_MISSING_SUBREDDIT",
  "TWITCH_MISSING_USERNAME",
  "TWITCH_CHANNEL_NOT_FOUND",
  "YOUTUBE_MISSING_CHANNEL_URL",
  "YOUTUBE_INVALID_CHANNEL_URL",
  "HTTP_MISSING_URL",
  "HTTP_INVALID_RESPONSE_CONTENT_TYPE",
  "HTTP_INVALID_RESPONSE_STATUS_CODE",
  "HTTP_DATA_PATH_MANDATORY",
  "GAME_MISSING_ADDRESS",
  "GAME_MISSING_PORT",
  "GAME_MISSING_GAME_ID",
  "BOT_HAS_NO_ENOUGH_PRIVILEGED_INTENTS",
  "BOT_IS_NOT_PREMIUM",
  "MEMBER_COUNT_NOT_AVAILABLE",
  "EVALUATION_TIMEOUT",
] as const;

export type DataSourceError = (typeof DataSourceErrorNames)[number];
