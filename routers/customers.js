/** @format */

const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const { Customer, validate } = require("../models/customer");


// Get all the customers
route.get("/", (req, res) => {
  Customer.find()
    .sort({ name: 1 })
    .then((result) => res.send(result));
});

// Get single customer
route.get("/:id", (req, res) => {
  Customer.find({ _id: req.params.id }).then((result) => res.send(result));
});

// add a new customer
route.post("/", (req, res) => {
  // validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  customer.save().then((result) => res.send(result));
});

// Updating a customer
route.put("/:id", async (req, res) => {
  // check if id is valid
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidId) return res.status(400).send("ID is not valid");

  // validation
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.params.id); 
  // If customer not found, return 404, otherwise update it
  if (!customer) return res.status(404).send("Customer with the given ID was not found");
  
  // update
  customer.set({
    name: req.body.name ? req.body.name : customer.name, 
    isGold: req.body.isGold ? req.body.isGold : customer.isGold, 
    phone: req.body.phone ? req.body.phone : customer.phone, 
  });

  const result = await customer.save();

  res.send(result);
});

// Deleting a customer
route.delete("/:id", async (req, res) => {
  // check if id is valid
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidId) return res.status(400).send("ID is not valid");

  // delete
  const customer = await Customer.findByIdAndRemove(req.params.id);

  // If customer not found, return 404, otherwise delete it
  if (!customer)
    return res.status(404).send("Customer with the given ID was not found");

  res.send(customer);
});



module.exports = route;
