import { NODE_ENV } from "../config";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const getDailyRotateFileTransport = (type: string, level: string) => {
  return new DailyRotateFile({
    filename: `./logs/%DATE%/${type}.log`,
    datePattern: "YYYY-MM-DD",
    level,
  });
};

const levels = {
  error: 0,
  info: 2,
  debug: 4,
};

const level = () => {
  const currentEnv = NODE_ENV || "development";
  return currentEnv === "development" ? "debug" : "info";
};

const colors = {
  error: "red",
  info: "green",
  debug: "white",
};

winston.addColors(colors);

const customPrint = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

const format = winston.format.combine(winston.format.align(), winston.format.simple(), winston.format.errors({ stack: true }), winston.format.timestamp({ format: "DD-MMM-YYYY HH:mm:ss:ms" }), customPrint);

const transports = [getDailyRotateFileTransport("error", "error"), getDailyRotateFileTransport("debug", "debug")];

const logger = winston.createLogger({
  level: level(),
  exitOnError: false,
  levels,
  format,
  transports,
  exceptionHandlers: [getDailyRotateFileTransport("exception", "")],
  rejectionHandlers: [getDailyRotateFileTransport("rejection", "")],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.align(), winston.format.simple(), winston.format.errors({ stack: true }), winston.format.timestamp({ format: "DD-MMM-YYYY HH:mm:ss:ms" }), winston.format.colorize({ all: true }), customPrint),
  })
);

process.on("unhandledRejection", (reason) => logger.debug(reason));
process.on("uncaughtException", (error) => logger.debug(error));
process.on("warning", (error) => logger.warn(error.stack));

export default logger;
