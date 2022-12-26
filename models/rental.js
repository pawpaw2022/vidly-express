/** @format */

const Joi = require("joi");
const mongoose = require("mongoose");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    // we don't import schema as we only need certain props
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 1,
          maxlength: 20,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
        phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 20,
        },
      }),
      required: true,
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 3,
          maxlength: 255,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          default: Date.now,
        },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      default: Date.now(),
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
      default: 4.99,
    },
  })
);

// validation w Joi
function validateRentals(movie) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(movie, { allowUnknown: true });
}

exports.Rental = Rental;
exports.validate = validateRentals;
