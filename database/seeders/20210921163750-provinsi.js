"use strict";
const provinsi = require("./sources/provinsi.js");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert("Provinsi", provinsi);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("Provinsi", null, {});
  },
};
