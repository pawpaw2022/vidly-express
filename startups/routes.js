/** @format */

const express = require("express");
const genres = require("../routers/genres");
const customers = require("../routers/customers");
const movies = require("../routers/movies");
const rentals = require("../routers/rentals");
const users = require("../routers/users");
const auth = require("../routers/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  // add middleware
  app.use(express.json());

  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  // add error middleware
  app.use(error);
};
