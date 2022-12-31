/** @format */

const jwt = require("jsonwebtoken");
const { User } = require("../../models/user");
const config = require("config");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      // generate a valid ID
      _id: new mongoose.Types.ObjectId(),
      isAdmin: false,
    };
    const user = new User(payload);

    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});
