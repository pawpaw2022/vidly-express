/** @format */

const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../app");
  });
  afterEach(async () => {
    server.close();
    await Genre.deleteMany({}); // wipe out all data after done
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBe(true);
      expect(res.body.some((g) => g.name === "genre2")).toBe(true);
    });
  });

  describe("GET /:id", () => {
    it("should return a genre given a valid id", async () => {
      // simulate a new genre
      const newGenre = new Genre({
        name: "genre1",
      });
      await newGenre.save();

      // get the genre from db
      const res = await request(server).get(`/api/genres/${newGenre._id}`);

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("name", newGenre.name);
      expect(res.body[0]).toHaveProperty("_id", newGenre._id.toString());
    });

    it("should return 404 given an invalid id ", async () => {
      // simulate an invalid id
      const res = await request(server).get("/api/genres/12345");
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should 401 if client is not logged in", async () => {
      const res = await request(server)
        .post("/api/genres")
        .send({ name: "genre1" });

      expect(res.status).toBe(401);
    });

    it("should 400 if genre is less than 3 characters.", async () => {
      // generate auth token
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "ab" });

      expect(res.status).toBe(400);
    });

    it("should 400 if genre is more than 50 characters.", async () => {
      // generate auth token
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: new Array(52).join("a") }); // str length = 51;

      expect(res.status).toBe(400);
    });

    it("should save the genre if valid", async () => {
      // generate auth token
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "genre1" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /:id", () => {
    it("should 401 if client is not logged in", async () => {
      // simulate a new genre
      const newGenre = new Genre({
        name: "genre1",
      });
      await newGenre.save();

      // simulate operation
      const res = await request(server)
        .put(`/api/genres/${newGenre._id}`)
        .send({ name: "genre2" });
      expect(res.status).toBe(401);
    });

    it("should 403 if client is not admin", async () => {
      // simulate a new genre
      const newGenre = new Genre({
        name: "genre1",
      });
      await newGenre.save();

      // generate auth token
      const token = new User().generateAuthToken();

      const res = await request(server)
        .put(`/api/genres/${newGenre._id}`)
        .set("x-auth-token", token)
        .send({ name: "genre2" });
      expect(res.status).toBe(403);
    });

    it("should 404 if genre is not found", async () => {
      // simulate a new genre
      const newGenre = new Genre({
        name: "genre1",
      });
      await newGenre.save();

      // generate auth token
      const token = new User({
        _id: mongoose.Types.ObjectId(),
        isAdmin: true,
      }).generateAuthToken();

      const res = await request(server)
        .put(`/api/genres/${mongoose.Types.ObjectId()}`)
        .set("x-auth-token", token)
        .send({ name: "genre2" });
      expect(res.status).toBe(404);
    });
    it("should 400 if req.body is invalid", async () => {
      // simulate a new genre
      const newGenre = new Genre({
        name: "genre1",
      });
      await newGenre.save();

      // generate auth token
      const token = new User({
        _id: mongoose.Types.ObjectId(),
        isAdmin: true,
      }).generateAuthToken();

      const res = await request(server)
        .put(`/api/genres/${newGenre._id}`)
        .set("x-auth-token", token)
        .send({ name: "" });
      expect(res.status).toBe(400);
    });

    it("should update a genre if valid id", async () => {
      // simulate a new genre
      const newGenre = new Genre({
        name: "genre1",
      });
      await newGenre.save();

      // generate auth token
      const token = new User({
        _id: mongoose.Types.ObjectId(),
        isAdmin: true,
      }).generateAuthToken();

      const res = await request(server)
        .put(`/api/genres/${newGenre._id}`)
        .set("x-auth-token", token)
        .send({ name: "genre2" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "genre2");
    });
  });
  describe("DELETE /:id", () => {
    it("should 401 if client is not logged in", async () => {
      const newGenre = new Genre({
        name: "genre1",
      });
      await newGenre.save();

      const res = await request(server).delete(`/api/genres/${newGenre._id}`);
      expect(res.status).toBe(401);
    });

    it("should 403 if client is not admin", async () => {
      const newGenre = new Genre({
        name: "genre1",
      });
      await newGenre.save();

      // generate auth token
      const token = new User().generateAuthToken();

      const res = await request(server)
        .delete(`/api/genres/${newGenre._id}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });

    it("should 404 if genre is not found", async () => {
      const newGenre = new Genre({
        name: "genre1",
      });
      await newGenre.save();

      // generate auth token
      const token = new User({
        _id: mongoose.Types.ObjectId(),
        isAdmin: true,
      }).generateAuthToken();

      const res = await request(server)
        .delete(`/api/genres/${mongoose.Types.ObjectId()}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });

    it("should delete a genre if valid id", async () => {
      const newGenre = new Genre({
        name: "genre1",
      });
      await newGenre.save();

      // generate auth token
      const token = new User({
        _id: mongoose.Types.ObjectId(),
        isAdmin: true,
      }).generateAuthToken();

      const res = await request(server)
        .delete(`/api/genres/${newGenre._id}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
