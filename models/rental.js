/** @format */

const Joi = require("joi");
const mongoose = require("mongoose");
const moment = require("moment/moment");

const rentalSchema = new mongoose.Schema({
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
        default: 4.99,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
    default: 0,
  },
});

// define static class method
rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    "customer._id": customerId,
    "movie._id": movieId,
  });
};

rentalSchema.methods.proceedReturn = function () {
  // Set the return date
  this.dateReturned = moment().toDate();
  
  // Calculate the rental fee
  const diff = moment().diff(this.dateOut, "days");
  this.rentalFee = this.movie.dailyRentalRate * diff;
};

const Rental = mongoose.model("Rental", rentalSchema);
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
