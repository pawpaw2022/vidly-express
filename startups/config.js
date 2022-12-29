/** @format */

const config = require("config");
const logger = require("../middleware/winston");

// console.log(process.env['NODE_ENV']);
// console.log(process.env);

module.exports = () => {
  if (!config.get("jwtPrivateKey")) {
    logger.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
  }
};
