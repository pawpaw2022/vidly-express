/** @format */

const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

// validation w Joi
function validateGenres(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(genre, { allowUnknown: true });
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenres;
