/** @format */

// Build a web server
const express = require("express");
const genres = require("./routers/genres"); 

const app = express();

// add middleware
app.use(express.json());
app.use("/api/genres", genres)

// Listen on port 3000
const port = process.env.PORT || 3000; // export PORT=4000
app.listen(port, () => console.log(`Listening to port ${port}`));
