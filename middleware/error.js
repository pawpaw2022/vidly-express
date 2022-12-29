/** @format */

const logger = require("./winston");

module.exports = function (err, req, res, next) {
  // log the exception
  logger.log("error", err.message);

  // level: error, warn, info, verbose, debug, silly

  res.status(500).send("Something failed.");
};
