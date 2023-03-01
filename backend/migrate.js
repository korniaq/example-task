const Sequelize = require("sequelize");
const { Umzug, SequelizeStorage } = require("umzug");

const isDev = process.env.NODE_ENV === "dev";

// Connect to the database
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `${isDev ? "dev" : ""}database.sqlite`,
});

// Run migrations
const umzug = new Umzug({
  migrations: { glob: "migrations/*.js" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

(async () => {
  await umzug.up();
})();
