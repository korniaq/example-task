const { Model } = require("sequelize");
const validators = require("../utils/validators");

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {}
  Log.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      log: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          is: validators.logRegexp,
        },
        get() {
          try {
            // Get logs with severity at least 50
            const log = this.getDataValue("log");
            const relevantLines = log.split("\n").filter((line) => {
              const errorHead = line.match(validators.errorLogHeadRegexp);
              return (
                errorHead !== null && Number(errorHead[0].split(/\s+/)[1]) >= 50
              );
            });
            return relevantLines;
          } catch {
            throw new Error("Database reading error");
          }
        },
        set(log) {
          // Filter invalid logs and sort by timestamp
          try {
            const processedLog = log
              .split("\n")
              .filter((line) => validators.singleLogRegexp.test(line))
              .sort((a, b) => {
                const headA = a.match(validators.logHeadRegexp)[0];
                const headB = b.match(validators.logHeadRegexp)[0];

                const timestampA = headA.split(/\s+/).pop();
                const timestampB = headB.split(/\s+/).pop();

                return timestampA - timestampB;
              })
              .join("\n");
            this.setDataValue("log", processedLog);
          } catch {
            throw new Error("Database writing error");
          }
        },
      },
    },
    {
      sequelize,
      modelName: "Log",
      timestamps: false,
    }
  );
  return Log;
};
