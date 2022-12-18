/** @format */

const express = require("express");
const route = express.Router();
const Joi = require("joi");
const mongoose = require("mongoose"); 

const Genre = mongoose.model("Genre", new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    minlength: 5,
    maxlength: 50 
  }
})); 

// Get all the genres
route.get("/", (req, res) => {
  Genre.find().sort({ name: 1 }).then(result => res.send(result));
});

// Get single genre
route.get("/:id", (req, res) => {
  Genre.find({ _id: req.params.id }).then(result => res.send(result));
});

// add a new genre
route.post("/", (req, res) => {
  // validation
  const { error } = validateGenres(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name
  }); 

  genre.save().then(result => res.send(result));

});

// Updating a genre
route.put("/:id", async(req, res) => {
    // If genre not found, return 404, otherwise update it
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Genre not found");
    
    // validation
    const { error } = validateGenres(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // update (Query first)
    const result = await Genre.findByIdAndUpdate({ _id: req.params.id }, {    
      $set: { name: req.body.name }
    }, { new: true });

    res.send(result); 
});

// Deleting a genre
route.delete("/:id", async(req, res) => {
    // If genre not found, return 404, otherwise delete it
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Genre not found");

    // delete 
    const result = await Genre.findByIdAndRemove(req.params.id);

    res.send(result);
});

// validation w Joi
function validateGenres(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre, { allowUnknown: true });
}


module.exports = route; 
