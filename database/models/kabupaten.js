"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kabupaten extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Kabupaten.hasMany(models.Kecamatan, { foreignKey: "kabupatenId" });
      Kabupaten.hasMany(models.Pasien, { foreignKey: "tempatLahirId" });
      Kabupaten.belongsTo(models.Provinsi, { foreignKey: "provinsiId" });
    }
  }
  Kabupaten.init(
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
      provinsiId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "Provinsi",
          },
          key: "id",
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "Kabupaten",
      // tableName: "Kabupaten",
      name: {
        singular: "kabupaten",
        plural: "kabupaten",
      },
      freezeTableName: true,
    }
  );
  return Kabupaten;
};
