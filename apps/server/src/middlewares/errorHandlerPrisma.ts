import type { NextFunction, Request, Response } from "express";

import { KnownError } from "@mc/common/KnownError/index";
import { Prisma } from "@mc/db";

export const errorHandlerPrisma = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2025":
        return res
          .status(404)
          .json({ error: new KnownError("NOT_FOUND").message });
      case "P2002":
        return res
          .status(400)
          .json({ error: new KnownError("BAD_REQUEST").message });
    }
  }
  next(err);
};
