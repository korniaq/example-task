const { Sequelize } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
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
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable("Logs");
  },
};
