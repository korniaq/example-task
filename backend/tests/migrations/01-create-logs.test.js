const { Sequelize } = require("sequelize");
const migration = require("../../migrations/01-create-log");

describe("01 create logs migration", () => {
  let sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize("sqlite::memory:");
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await sequelize.close();
  });

  describe("up", () => {
    it("should create Logs table with the expected columns and data types", async () => {
      const queryInterface = sequelize.getQueryInterface();
      await migration.up({ context: queryInterface });

      const table = await queryInterface.describeTable("Logs");

      expect(table).toHaveProperty("id");
      expect(table.id.type).toEqual("INTEGER");
      expect(table.id.primaryKey).toBe(true);

      expect(table).toHaveProperty("name");
      expect(table.name.type).toEqual("VARCHAR(255)");
      expect(table.name.allowNull).toBe(false);

      expect(table).toHaveProperty("email");
      expect(table.email.type).toEqual("VARCHAR(255)");
      expect(table.email.allowNull).toBe(false);

      expect(table).toHaveProperty("log");
      expect(table.log.type).toEqual("TEXT");
      expect(table.log.allowNull).toBe(false);
    });
  });

  describe("down", () => {
    it("should drop Logs table", async () => {
      const queryInterface = sequelize.getQueryInterface();

      await queryInterface.createTable("Logs", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          notEmpty: true,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          notEmpty: true,
          isEmail: true,
        },
        log: {
          type: Sequelize.TEXT,
          allowNull: false,
          notEmpty: true,
        },
      });

      const beforeTableNames = await queryInterface.showAllTables();
      expect(beforeTableNames).toContain("Logs");

      await migration.down({ context: queryInterface });

      const afterTableNames = await queryInterface.showAllTables();
      expect(afterTableNames).not.toContain("Logs");
    });
  });
});
