"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "Pasien",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        nama: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        gelar: {
          type: Sequelize.JSONB,
          allowNull: true,
        },
        noRm: {
          type: Sequelize.STRING,
        },
        tempatLahirId: {
          type: Sequelize.INTEGER,
          references: {
            model: {
              tableName: "Kabupaten",
            },
            key: "id",
          },
          allowNull: true,
        },
        tanggalLahir: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        jenisKelamin: {
          type: Sequelize.STRING,
        },
        alamatId: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: "Alamat",
            },
            key: "id",
          },
          allowNull: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      },
      {
        freezeTableName: true,
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Pasien");
  },
};
