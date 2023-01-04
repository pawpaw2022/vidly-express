/** @format */

// TODO: Finish this in TDD.

// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental found for this cutomer/movie
// Return 400 if rental already processed
// Return 200 if valid request
// Set the return date
// Calculate the rental fee
// Increase the stock
// Return the rental

const moment = require("moment/moment");
const mongoose = require("mongoose");
const request = require("supertest");
const { Customer } = require("../../models/customer");
const { Genre } = require("../../models/genre");
const { Movie } = require("../../models/movie");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");

let server;
let rental;
let customer;
let movie;
let customerId;
let movieId;
let token;
let happyPath;

beforeAll(() => {
  server = require("../../app");
});

afterAll(() => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  server.close();
});

describe("/api/returns", () => {
  // POST /api/returns {customerId, movieId}
  beforeEach(async () => {
    // new Customer
    customer = new Customer({
      name: "Annomyous1",
      phone: "12345",
    });

    await customer.save();

    // new Movie
    movie = new Movie({
      title: "new Movie",
      genre: new Genre({ name: "new Genre" }),
      dailyRentalRate: 2,
      numberInStock: 5,
    });

    await movie.save();

    customerId = customer._id;
    movieId = movie._id;
    // new Rental
    rental = new Rental({
      customer: {
        _id: customerId,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movieId,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    await rental.save();

    token = new User().generateAuthToken();
    happyPath = () => {
      return request(server)
        .post("/api/returns")
        .set("x-auth-token", token)
        .send({ customerId: customerId, movieId: movieId });
    };
  });

  afterEach(async () => {
    await Rental.deleteMany({}); // wipe out all data after done
    await Customer.deleteMany({});
    await Genre.deleteMany({});
  });
  describe("POST /", () => {
    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await happyPath();

      expect(res.status).toBe(401);
    });

    it("should return 400 if customerId is not provided", async () => {
      customerId = "";
      const res = await happyPath();

      expect(res.status).toBe(400);
    });

    it("should return 400 if movieId is not provided", async () => {
      movieId = "";
      const res = await happyPath();

      expect(res.status).toBe(400);
    });

    it("should return 404 if no customer is found with the given id", async () => {
      customerId = mongoose.Types.ObjectId();
      let res = await happyPath();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no movie is found with the given id", async () => {
      movieId = mongoose.Types.ObjectId();
      const res = await happyPath();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no rental is found", async () => {
      await Rental.deleteMany({});
      const res = await happyPath();

      expect(res.status).toBe(404);
    });

    it("should return 400 if rental already processed", async () => {
      rental.dateReturned = new Date();
      await rental.save();

      const res = await happyPath();

      expect(res.status).toBe(400);
    });

    it("should return 200 if valid request", async () => {
      rental.dateOut = moment().add(-5, "days").toDate(); // assume 5 days ago
      await rental.save();

      const res = await happyPath();

      // testing other properties
      const newRental = await Rental.findById(rental._id);
      const newMovie = await Movie.findById(movieId);

      expect(res.status).toBe(200);
      expect(newRental.dateReturned).toBeDefined();
      expect(newRental.rentalFee).toBe(5 * rental.movie.dailyRentalRate);
      expect(newMovie.numberInStock).toBe(movie.numberInStock + 1);

      expect(Object.keys(res.body)).toEqual(
        expect.arrayContaining([
          "dateOut",
          "dateReturned",
          "rentalFee",
          "customer",
          "movie",
        ])
      );
    });
  });
});
