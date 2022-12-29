/** @format */

const mongoose = require("mongoose");
const logger = require("../middleware/winston");


module.exports = function(){
  mongoose.set("strictQuery", true);
  mongoose
    .connect("mongodb://localhost:27017/vidly-express")
    .then(() => logger.info("Connected to db!"))
    .catch((err) => logger.error("Could not connect to database: ", err.message));
  
};
