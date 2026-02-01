import type { NextFunction, Request, Response } from "express";

import { KnownError } from "@mc/common/KnownError/index";
import logger from "@mc/logger";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof Error) {
    logger.error(err.message, {
      path: req.path,
      stack: err.stack,
    });
  }
  if (err instanceof KnownError) {
    res.status(400).json({ error: err.message });
  } else {
    res
      .status(500)
      .json({ error: new KnownError("INTERNAL_SERVER_ERROR").message });
  }
};
