/** @format */

const mongoose = require("mongoose");
const logger = require("../middleware/winston");
const config = require("config");

module.exports = function () {
  const db = config.get("db");
  // console.log(db);
  mongoose.set("strictQuery", true);
  mongoose
    .connect(db)
    .then(() => logger.info(`Connected to ${config.get("db")}!`))
    .catch((err) =>
      logger.error("Could not connect to database: ", err.message)
    );
};
