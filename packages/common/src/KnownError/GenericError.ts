export const GenericErrorNames = [
  "INTERNAL_SERVER_ERROR",
  "NOT_FOUND",
  "BAD_REQUEST",
  "UNAUTHORIZED",
  "FORBIDDEN",
] as const;

export type GenericError = (typeof GenericErrorNames)[number];
