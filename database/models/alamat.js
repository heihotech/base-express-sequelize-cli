"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Alamat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Alamat.belongsTo(models.Desa, { foreignKey: "desaId" });
    }
  }
  Alamat.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      alamatLengkap: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rw: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      kodePos: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      noTelepon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      desaId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "Desa",
          },
          key: "id",
        },
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      name: {
        singular: "alamat",
        plural: "alamat",
      },
      // tableName: "Alamat",
      modelName: "Alamat",
      freezeTableName: true,
    }
  );
  return Alamat;
};
