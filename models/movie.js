/** @format */

const Joi = require("joi");
const mongoose = require("mongoose");

const { genreSchema } = require("./genre");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      min: 0,
      max: 255,
      required: true,
    },
    dailyRentalRate: {
      type: Number,
      min: 0,
      max: 255,
    },
  })
);

// validation w Joi
// Joi validate User's Input
// Mongoose validate ultimate version
function validateMovies(movie) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255),
  });

  return schema.validate(movie, { allowUnknown: true });
}

function validateUpdatedMovies(movie) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255),
    genreId: Joi.objectId(),
    numberInStock: Joi.number().min(0).max(255),
    dailyRentalRate: Joi.number().min(0).max(255),
  });
  return schema.validate(movie, { allowUnknown: true });
}

exports.Movie = Movie;
exports.validate = validateMovies;
exports.validateUpdate = validateUpdatedMovies;
