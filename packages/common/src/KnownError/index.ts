import type { DataSourceError } from "./DataSourceError";
import type { UserError } from "./UserError";

export type ErrorCause = DataSourceError | UserError;

export class KnownError extends Error {
  constructor(public cause: ErrorCause) {
    super(cause.type, { cause });
  }
}
