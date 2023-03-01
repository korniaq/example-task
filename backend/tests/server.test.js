const { Sequelize, DataTypes } = require("sequelize");
const request = require("supertest");
const Log = require("../models/log");
const app = require("../server");

describe("GET /", () => {
  let sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize("sqlite::memory:");
    sequelize.Log = Log(sequelize, DataTypes);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should return 200 OK", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });
});

describe("POST /api/logs", () => {
  it("should create a new log and return it as JSON", async () => {
    const log = {
      name: "Test",
      email: "test@test.com",
      log: "E 50 1 Test",
    };
    const response = await request(app)
      .post("/api/logs")
      .send(log)
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(log.name);
    expect(response.body.email).toEqual(log.email);
    expect(response.body.log[0]).toEqual(log.log);
  });

  it("should return an error if a required field is missing", async () => {
    const log = {
      name: "Test",
      email: "test@test.com",
    };
    const response = await request(app)
      .post("/api/logs")
      .send(log)
      .set("Accept", "application/json");
    expect(response.status).toBe(400);
  });
});
