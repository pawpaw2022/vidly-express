/** @format */

const express = require("express");
const route = express.Router();
const { User } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

// add a new user
route.post("/", async (req, res) => {
  // validation request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // validate email
  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send("This email has not been registered yet.");

  // validate password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Wrong Password.");

  // issue JWT
  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req, { allowUnknown: true });
}

module.exports = route;
