/** @format */
const mongoose = require("mongoose");

module.exports = (req, res, next) => {
  // validate ID
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidId) return res.status(404).send("ID is not valid");

  next();
};
