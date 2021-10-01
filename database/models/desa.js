"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Desa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Desa.belongsTo(models.Kecamatan, { foreignKey: "kecamatanId" });
      Desa.hasMany(models.Alamat, { foreignKey: "desaId" });
    }
  }
  Desa.init(
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
      kecamatanId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "Kecamatan",
          },
          key: "id",
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "Desa",
      name: {
        singular: "desa",
        plural: "desa",
      },
      freezeTableName: true,
    }
  );
  return Desa;
};
