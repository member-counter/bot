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
  level: env.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    env.NODE_ENV === "development"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.timestamp(),
    winston.format.printf(
      ({ level, message, timestamp, source, ...metadata }) => {
        const metadataStr = Object.keys(metadata).length
          ? "metadata: " + inspect(metadata)
          : null;

        const metadataSerialized =
          Object.keys(metadata).length &&
          JSON.stringify(metadata, (_, v: unknown) =>
            typeof v === "bigint" ? v.toString() : v,
          );
        const metadataJSONStr = Object.keys(metadata).length
          ? "metadata as JSON: " + JSON.stringify(metadataSerialized)
          : null;

        const messageStr = `${level}: ${message}`;

        return [timestamp, source, messageStr, metadataStr, metadataJSONStr]
          .filter(Boolean)
          .join(" - ");
      },
    ),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

export default logger;
