// utils/logger.js
const { createLogger, format, transports } = require("winston");
const path = require("path");

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
);

const logger = createLogger({
  level: "info", // <- include both info and error
  format: logFormat,
  transports: [
    new transports.File({ filename: path.join("logs", "error.log"), level: "error" }),
    new transports.File({ filename: path.join("logs", "activity.log"), level: "info" }),
  ],
});

module.exports = logger;
