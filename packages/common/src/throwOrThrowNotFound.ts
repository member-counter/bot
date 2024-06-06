import { KnownError } from "@mc/db";

export class NotFoundError extends Error {}

export const throwOrThrowNotFound = (error: unknown) => {
  if (error instanceof KnownError && error.code === "P2025") {
    throw new NotFoundError();
  }
  throw error;
};
