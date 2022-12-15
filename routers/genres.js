/** @format */

const express = require("express");
const route = express.Router();
const Joi = require("joi");

// init genres
const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Comedy" },
  { id: 3, name: "Documentary" },
];

// Get all the genres
route.get("/", (req, res) => {
  res.send(genres);
});

// add a new genre
route.post("/", (req, res) => {
  // validation
  const { error } = validateGenres(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Create the genre and return the genre object
  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  genres.push(genre);

  res.send(genre);
});

// Updating a genre
route.put("/:id", (req, res) => {
  // If genre not found, return 404, otherwise update it
  let genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found");

  // validation
  const { error } = validateGenres(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // and return the updated object.
  genre.name = req.body.name;
  res.send(genre);
});

// Deleting a genre
route.delete("/:id", (req, res) => {
  // If genre not found, return 404, otherwise delete it
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("genre not found!");

  // delete
  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  // and return the deleted object.
  res.send(genre);
});

// validation
function validateGenres(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre, { allowUnknown: true });
}


module.exports = route; 
