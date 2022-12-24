/** @format */

// Build a web server
const express = require("express");
const genres = require("./routers/genres"); 
const customers = require("./routers/customers"); 
const movies = require("./routers/movies"); 
const mongoose = require("mongoose"); 

const app = express();


mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/vidly-express") 
    .then(()=> console.log("Connected!"))
    .catch(err => console.log("Could not connect to MongoDB: ", err));

// add middleware
app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);

// Listen on port 3000
const port = process.env.PORT || 3000; // export PORT=4000
app.listen(port, () => console.log(`Listening to port ${port}`));
