import { DataSourceErrorNames } from "./DataSourceError";
import { UserErrorNames } from "./UserError";

export const KnownErrorsTypeNames = [
  ...DataSourceErrorNames,
  ...UserErrorNames,
] as const;
export type KnownErrorType = (typeof KnownErrorsTypeNames)[number];

export class KnownError extends Error {
  constructor(
    public message: KnownErrorType,
    options?: ErrorOptions,
  ) {
    super(message, options);
  }
}
