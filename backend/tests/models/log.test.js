const { Sequelize, DataTypes } = require("sequelize");
const Log = require("../../models/log");

describe("Log model", () => {
  let sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize("sqlite::memory:");
    sequelize.Log = Log(sequelize, DataTypes);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a new log with the correct attributes", async () => {
    const log = await sequelize.Log.create({
      name: "Test",
      email: "test@test.com",
      log: "E 50 1 Test",
    });

    expect(log.id).toBeDefined();
    expect(log.name).toBe("Test");
    expect(log.email).toBe("test@test.com");
    expect(log.log[0]).toBe("E 50 1 Test");
  });

  it("should not create a new log if the email is not valid", async () => {
    await expect(
      sequelize.Log.create({
        name: "Test",
        email: "invalidemail",
        log: "I 1 Test",
      })
    ).rejects.toThrow();
  });

  it("should sort the errors by timestamp", async () => {
    const log = await sequelize.Log.create({
      name: "Test",
      email: "test@test.com",
      log: "I 5 Test 5\nW 2 Test 2\nI 3 Test 3\n",
    });

    expect(log.getDataValue("log")).toBe("W 2 Test 2\nI 3 Test 3\nI 5 Test 5");
  });

  it("should not save invalid logs", async () => {
    const log = await sequelize.Log.create({
      name: "Test",
      email: "test@test.com",
      log: "I 5 Test 5\nW 2 Test 2\nE 3 Test 3\n",
    });

    expect(log.getDataValue("log")).toBe("W 2 Test 2\nI 5 Test 5");
  });

  it("should retrieve all error logs with a severity of 50 or higher", async () => {
    const log = await sequelize.Log.create({
      name: "Test",
      email: "test@test.com",
      log: "E 10 1 Test 10\nE 50 2 Test 50\nI 3 Test\n",
    });

    expect(log.log.length).toBe(1);
    expect(log.log[0]).toBe("E 50 2 Test 50");
  });
});
