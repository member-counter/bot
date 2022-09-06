import config from "./config";
import path from "path";
import winston from "winston";

const enumerateErrorFormat = winston.format((info) => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.stack });
	}
	return info;
});

const logger = winston.createLogger({
	level: config.env === "development" ? "debug" : "info",
	format: winston.format.combine(
		enumerateErrorFormat(),
		config.env === "development"
			? winston.format.colorize()
			: winston.format.uncolorize(),
		winston.format.splat(),
		winston.format.timestamp(),
		winston.format.printf(
			({ level, message, timestamp }) =>
				`${config.logs.showDate && `${timestamp} - `}${level}: ${message}`
		)
	),
	transports: [
		new winston.transports.Console({
			stderrLevels: ["error"]
		}),
		config.logs.save &&
			new winston.transports.File({
				filename: path.join(
					__dirname,
					"..",
					"logs",
					`${new Date().toISOString().replace(/:/g, "-")}.log`
				)
			})
	].filter((t) => t)
});

export default logger;
