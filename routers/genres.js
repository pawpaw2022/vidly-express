/** @format */

const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const getOrSetRedisCache = require("../middleware/redis")

// Get all the genres
route.get("/", async(req, res) => {

  const result = await getOrSetRedisCache('genres', async()=>{
    const data = await Genre.find().sort({ name: 1 })
    return data
  })
  res.send(result)
});

// Get single genre
route.get("/:id", async(req, res) => {
  const result = await getOrSetRedisCache('genres/'+req.params.id, async()=>{
    const data = await Genre.find({ _id: req.params.id })
    return data
  })
  res.send(result)
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
route.put("/:id", [auth, admin, validateObjectId], async (req, res) => {
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
route.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  // delete
  const genre = await Genre.findByIdAndRemove(req.params.id);

  // If genre not found, return 404, otherwise delete it
  if (!genre)
    return res.status(404).send("Genre with the given ID was not found");

  res.send(genre);
});

module.exports = route;
