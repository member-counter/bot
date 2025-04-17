import { inspect } from "util";
import winston from "winston";

import { env } from "./env";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }

  if (info.error instanceof Error) {
    Object.assign(info, { message: info.error.stack });
  }

  return info;
});

const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    enumerateErrorFormat(),
    env.NODE_ENV === "development"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, ...rest }) => {
      const format = (something: unknown) =>
        typeof something === "string" ? something : inspect(something);

      return [
        timestamp,
        level,
        `[${Object.entries(rest)
          .filter(([key]) => typeof key !== "symbol")
          .filter(([key]) => Number.isNaN(Number(key)))
          .map((pair) => pair.join(": "))
          .join(", ")}]`,
        format(message),
      ]
        .filter(Boolean)
        .join(" - ");
    }),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

export default logger;
