"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pasien extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pasien.belongsTo(models.Kabupaten, { foreignKey: "tempatLahirId" });
      Pasien.belongsTo(models.Alamat, { foreignKey: "alamatId" });
    }
  }
  Pasien.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gelar: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      noRm: {
        type: DataTypes.STRING,
      },
      tempatLahirId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "Kabupaten",
          },
          key: "id",
        },
        allowNull: true,
      },
      tanggalLahir: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      jenisKelamin: {
        type: DataTypes.STRING,
      },
      alamatId: {
        type: DataTypes.UUID,
        references: {
          model: {
            tableName: "Alamat",
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
      modelName: "Pasien",
      name: {
        singular: "pasien",
        plural: "pasien",
      },
      freezeTableName: true,
    }
  );
  return Pasien;
};
