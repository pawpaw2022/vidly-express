/** @format */

const winston = require("winston");
const { combine, timestamp, label, prettyPrint } = winston.format;

const logger = winston.createLogger({
  format: combine(timestamp(), prettyPrint()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "log/logfile.log" }),
  ],
});

// Handling Uncaught Exceptions with winston
logger.exceptions.handle(
  new winston.transports.Console(),
  new winston.transports.File({ filename: "log/exceptions.log" })
);

// Call rejections.handle with a transport to handle rejections
logger.rejections.handle(
  new winston.transports.Console(),
  new winston.transports.File({ filename: "log/rejections.log" })
);

module.exports = logger;
