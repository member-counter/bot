export const DataSourceEvaluationErrorTypes = [
  "UNKNOWN",
  "UNKNOWN_DATA_SOURCE",
  "UNKNOWN_EVALUATION_RETURN_TYPE",
  "FAILED_TO_RETURN_A_FINAL_STRING",
  "DELIMITED_DATA_SOURCE_IS_ILLEGAL_JSON",
  "DELIMITED_DATA_SOURCE_IS_INVALID",
  "EVALUATION_RESULT_FOR_CHANNEL_NAME_IS_LESS_THAN_2_CHARACTERS",
  "MEMERATOR_MISSING_USERNAME",
  "REDDIT_MISSING_SUBREDDIT",
  "TWITCH_MISSING_USERNAME",
  "TWITCH_CHANNEL_NOT_FOUND",
] as const;

export class DataSourceEvaluationError extends Error {
  constructor(message: (typeof DataSourceEvaluationErrorTypes)[number]) {
    super(message);
  }
}
