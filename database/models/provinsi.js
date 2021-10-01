"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Provinsi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Provinsi.hasMany(models.Kabupaten, { foreignKey: "provinsiId" });
    }
  }
  Provinsi.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "Provinsi",
      name: {
        singular: "provinsi",
        plural: "provinsi",
      },
      freezeTableName: true,
    }
  );
  return Provinsi;
};
