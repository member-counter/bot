import { Prisma } from "@prisma/client";

export class NotFoundError extends Error {}

export const throwNotFoundOrThrow = (error: unknown) => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    throw new NotFoundError();
  }
  throw error;
};
