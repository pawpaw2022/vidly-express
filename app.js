/** @format */

// Build a web server

const express = require("express");
const logger = require("./middleware/winston");

const app = express();
require("./startups/config")();
require("./startups/joi")();
require("./startups/db")();
require("./startups/routes")(app);

// Listen on port 3000
const port = process.env.PORT || 3000; // export PORT=4000
const server = app.listen(port, () => logger.info(`Listening to port ${port}`));

module.exports = server; 