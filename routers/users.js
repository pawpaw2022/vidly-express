/** @format */

const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const { User, validate } = require("../models/user");

// add a new user
route.post("/", async (req, res) => {
  // validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // validate uniqueness of email
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const result = await user.save();
  res.send(result);
});

module.exports = route;
