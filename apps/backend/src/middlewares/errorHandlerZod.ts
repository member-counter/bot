import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod/v4";

import { KnownError } from "@mc/common/KnownError/index";

export const errorHandlerZod = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ error: new KnownError("BAD_REQUEST").message });
  }
  next(err);
};
