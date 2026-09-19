import type { NextFunction, Request, Response } from "express";

import { env } from "../env";

export const devLatency = (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (env.NODE_ENV === "development") {
    setTimeout(
      () => {
        next();
      },
      100 + Math.random() * 20,
    );
  } else {
    next();
  }
};
