"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kecamatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Kecamatan.hasMany(models.Desa, { foreignKey: "kecamatanId" });
      Kecamatan.belongsTo(models.Kabupaten, { foreignKey: "kabupatenId" });
    }
  }
  Kecamatan.init(
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
      kabupatenId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "Kabupaten",
          },
          key: "id",
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "Kecamatan",
      name: {
        singular: "kecamatan",
        plural: "kecamatan",
      },
      freezeTableName: true,
    }
  );
  return Kecamatan;
};
