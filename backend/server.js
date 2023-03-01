const express = require("express");
const cors = require("cors");
const path = require("path");
const Log = require("./models/log");

const { Sequelize } = require("sequelize");

const isDev = process.env.NODE_ENV === "dev";
const isTest = process.env.NODE_ENV === "test";

let sequelize;
// Connect to the database
if (isTest) {
  sequelize = new Sequelize("sqlite::memory:");
  sequelize.Log = Log(sequelize, Sequelize.DataTypes);
  sequelize.sync({ force: true });
} else {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: `${isDev ? "dev" : ""}database.sqlite`,
  });
  // Add log model to sequelize
  sequelize.Log = Log(sequelize, Sequelize.DataTypes);
}

const PORT = process.env.PORT | 8000;
const app = express();
module.exports = app;

app.use(express.json());

if (isDev) {
  // allow cors from frontend dev server
  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: false,
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
} else {
  // set static path
  app.use(express.static(path.join(__dirname, "../frontend/build/")));
}

// Render frontend
app.get("/", function (req, res) {
  if (isDev) {
    res.send("Running dev server");
  } else if (isTest) {
    res.send("Running test server");
  } else {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  }
});

// Save log
app.post("/api/logs", async (req, res) => {
  try {
    const log = await sequelize.Log.create(req.body);
    res.json(log);
  } catch (err) {
    console.log(err);
    if (err.name === "SequelizeDatabaseError") {
      res.status(500).json("Database connection error");
    } else if (err.name === "SequelizeValidationError") {
      res.status(400).json("Validation error");
    } else {
      res.status(500).json(err.message);
    }
  }
});

// Run server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});
