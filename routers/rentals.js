/** @format */

const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");

// Get all the rentals
route.get("/", (req, res) => {
  Rental.find()
    .sort({ dateOut: -1, customer: 1, movie: 1 })
    .then((result) => res.send(result));
});

// Get single rental
route.get("/:id", (req, res) => {
  Rental.find({ _id: req.params.id }).then((result) => res.send(result));
});

// add a new rental
route.post("/", auth, async (req, res) => {
  // validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // find customer
  const customer = await Customer.findById(req.body.customerId);
  // If customer not found, return 404, otherwise update it
  if (!customer)
    return res.status(404).send("Customer with the given ID was not found");

  // find movie
  const movie = await Movie.findById(req.body.movieId);
  // If movie not found, return 404, otherwise update it
  if (!movie)
    return res.status(404).send("Movie with the given ID was not found");

  if (movie.numberInStock <= 0)
    return res.status(400).send("Movie is out of stock");

  // add
  const rental = new Rental({
    customer: {
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },

    movie: {
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  // 2 phase commits
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const result = await rental.save();

      // reduce the stock
      movie.numberInStock--;
      movie.save();

      res.send(result);
    });
    session.endSession();
  } catch (err) {
    return res.status(400).send("Failed to loan out the movie: ", err.message);
  }
});


module.exports = route;
