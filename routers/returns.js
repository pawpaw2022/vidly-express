/** @format */

const express = require("express");
const { escapeRegExp } = require("lodash");
const auth = require("../middleware/auth");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const { Rental } = require("../models/rental");
const route = express.Router();
const mongoose = require("mongoose");
const moment = require("moment/moment");

//
route.post("/", auth, async (req, res) => {
  // no customerId
  if (!req.body.customerId)
    return res.status(400).send("No customerId provided");

  // no movieId
  if (!req.body.movieId) return res.status(400).send("No movieId provided");

  const customer = await Customer.findById(req.body.customerId);
  // customer doesn't exist in customer db
  if (!customer)
    return res.status(404).send("No customer is found with the given id");

  const movie = await Movie.findById(req.body.movieId);
  // movie doesn't exist in movie db
  if (!movie)
    return res.status(404).send("No movie is found with the given id");

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });
  if (!rental) return res.status(404).send("No rental is found");

  // rental already processed
  if (rental.dateReturned)
    return res.status(400).send("Return has already processed.");

  // valid request:

  // Set the return date
  rental.dateReturned = moment().toDate();
  // Calculate the rental fee
  const diff = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rental.movie.dailyRentalRate * diff;

  console.log(diff);

  // 2 phase commits
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      // Return the rental
      const result = await rental.save();

      // Increase the stock
      movie.numberInStock++;
      await movie.save();

      console.log(result);
      res.send(result);
    });
    session.endSession();
  } catch (err) {
    return res.status(400).send("Failed to return the movie: ", err.message);
  }
});

module.exports = route;
