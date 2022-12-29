/** @format */

// Build a web server

const express = require("express");
const logger = require("./middleware/winston");

const app = express();
require("./startups/config")();
require("./startups/joi")();
require("./startups/routes")(app);
require("./startups/db")();

// Listen on port 3000
const port = process.env.PORT || 3000; // export PORT=4000
app.listen(port, () => logger.info(`Listening to port ${port}`));
