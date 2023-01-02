/** @format */
const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

const mongoose = require("mongoose");

let server;

beforeAll(() => {
  server = require("../../app");
});

afterAll(() => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  server.close();
});


describe("auth middleware", () => {

  afterEach(async () => {
    await Genre.deleteMany({}); // wipe out all data after done
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(server)
      .post("/api/genres")
      .set("x-auth-token", "")
      .send({ name: "genre1" });

    expect(res.status).toBe(401);
  });
  it("should return 400 if no token is invalid", async () => {
    const res = await request(server)
      .post("/api/genres")
      .set("x-auth-token", "abcd")
      .send({ name: "genre1" });

    expect(res.status).toBe(400);
  });
  it("should return 200 if valid token", async () => {
    const res = await request(server)
      .post("/api/genres")
      .set("x-auth-token", new User().generateAuthToken())
      .send({ name: "genre1" });

    expect(res.status).toBe(200);
  });
});
