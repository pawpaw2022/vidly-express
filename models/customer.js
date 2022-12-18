/** @format */

const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
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
  })
);

// validation w Joi
function validateCustomers(customer) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(20).required(),
    phone: Joi.string().min(5).max(20).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer, { allowUnknown: true });
}

exports.Customer = Customer; 
exports.validate = validateCustomers; 
