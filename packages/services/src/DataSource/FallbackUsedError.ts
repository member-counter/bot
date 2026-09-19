import type { DataSourceExecuteResult } from "./DataSourceEvaluator";

export class FallbackUsedError extends Error {
  constructor(
    public readonly fallback: DataSourceExecuteResult,
    public readonly cause: Error,
  ) {
    super(cause.message);
    this.name = "FallbackUsedError";
  }
}
