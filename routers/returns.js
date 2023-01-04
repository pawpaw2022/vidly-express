/** @format */

const express = require("express");
const Joi = require("joi");
const auth = require("../middleware/auth");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const { Rental } = require("../models/rental");
const route = express.Router();
const mongoose = require("mongoose");

const validate = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    next();
  };
};

route.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);
  const movie = await Movie.findById(req.body.movieId);
  // customer doesn't exist in customer db
  if (!customer)
    return res.status(404).send("No customer is found with the given id");
  // movie doesn't exist in movie db
  if (!movie)
    return res.status(404).send("No movie is found with the given id");

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
  if (!rental) return res.status(404).send("No rental is found");

  // rental already processed
  if (rental.dateReturned)
    return res.status(400).send("Return has already processed.");

  // valid request:

  rental.proceedReturn();

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

// validation w Joi
function validateReturn(obj) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });

  return schema.validate(obj, { allowUnknown: true });
}

module.exports = route;
