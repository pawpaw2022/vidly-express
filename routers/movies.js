/** @format */

const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");

// Get all the movies
route.get("/", (req, res) => {
  Movie.find()
    .sort({ title: 1 })
    .then((result) => res.send(result));
});

// Get single movie
route.get("/:id", (req, res) => {
  Movie.find({ _id: req.params.id }).then((result) => res.send(result));
});

// add a new movie
route.post("/", async (req, res) => {
  // validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // find genre
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre ID");

  const movie = new Movie({
    title: req.body.name,
    genre: { name: genre.name, _id: genre._id },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  movie.save().then((result) => res.send(result));
});

// Updating a movie
route.put("/:id", async (req, res) => {
  // check if id is valid
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidId) return res.status(400).send("ID is not valid");

  // validation
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

  // If movie not found, return 404, otherwise update it
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Movie not found");


  // if the user wants to update genre
  if (req.body.genreId && movie.genre._id.toString() !== req.body.genreId) {
    // find genre
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid Genre ID");
    // update genre
    movie.set({
        genre: { name: genre.name, _id: genre._id }
    })
  }

  // update
  movie.set({
    title: req.body.name ? req.body.name : movie.title,
    numberInStock: req.body.numberInStock
      ? req.body.numberInStock
      : movie.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
      ? req.body.dailyRentalRate
      : movie.dailyRentalRate,
  });

  const result = await movie.save();

  res.send(result);
});

// Deleting a movie
route.delete("/:id", async (req, res) => {
  // check if id is valid
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidId) return res.status(400).send("ID is not valid");

  // delete
  const movie = await Movie.findByIdAndRemove(req.params.id);

  // If movie not found, return 404, otherwise delete it
  if (!movie)
    return res.status(404).send("Movie with the given ID was not found");

  res.send(movie);
});

module.exports = route;
