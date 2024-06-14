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
      ({ level, message, timestamp, botId, ...metadata }) => {
        const metadataSerialized =
          Object.keys(metadata).length &&
          JSON.stringify(metadata, (_, v: unknown) =>
            typeof v === "bigint" ? v.toString() : v,
          );
        const metadataStr = metadataSerialized
          ? "metadata: " + metadataSerialized
          : null;
        const messageStr = `${level}: ${message}`;
        const botIdStr = botId ? `bot: ${botId}` : null;

        return [timestamp, botIdStr, messageStr, metadataStr]
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
