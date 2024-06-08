enum DataSourceEvaluationErrorType {
  UNKNOWN,
  UNKNOWN_DATA_SOURCE,
  UNKNOWN_EVALUATION_RETURN_TYPE,
  FAILED_TO_RETURN_A_FINAL_STRING,
  DELIMITED_DATA_SOURCE_IS_ILLEGAL_JSON,
  DELIMITED_DATA_SOURCE_IS_INVALID,
}

export class DataSourceEvaluationError extends Error {
  constructor(public type: keyof typeof DataSourceEvaluationErrorType) {
    super(type);
  }
}
