"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "Alamat",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        alamatLengkap: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        rt: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        rw: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        kodePos: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        noTelepon: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        desaId: {
          type: Sequelize.INTEGER,
          references: {
            model: {
              tableName: "Desa",
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
    await queryInterface.dropTable("Alamat");
  },
};
