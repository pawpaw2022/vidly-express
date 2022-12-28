/** @format */

const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Get all the genres
route.get("/", (req, res) => {
  Genre.find()
    .sort({ name: 1 })
    .then((result) => res.send(result));
});

// Get single genre
route.get("/:id", (req, res) => {
  Genre.find({ _id: req.params.id }).then((result) => res.send(result));
});

// add a new genre
route.post("/", auth, (req, res) => {
  // validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name,
  });

  genre.save().then((result) => res.send(result));
});

// Updating a genre
route.put("/:id", [auth, admin], async (req, res) => {
  // check if id is valid
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidId) return res.status(400).send("ID is not valid");

  // validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // update (Query first)
  const genre = await Genre.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: { name: req.body.name },
    },
    { new: true }
  );
  // If genre not found, return 404, otherwise update it
  if (!genre) return res.status(404).send("Genre not found");

  res.send(genre);
});

// Deleting a genre
route.delete("/:id", [auth, admin] ,async (req, res) => {
  // check if id is valid
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidId) return res.status(400).send("ID is not valid");

  // delete
  const genre = await Genre.findByIdAndRemove(req.params.id);

  // If genre not found, return 404, otherwise delete it
  if (!genre)
    return res.status(404).send("Genre with the given ID was not found");

  res.send(genre);
});

module.exports = route;
