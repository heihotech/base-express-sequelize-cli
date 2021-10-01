"use strict";
const kecamatan = require("./sources/kecamatan.js");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert("Kecamatan", kecamatan);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("Kecamatan", null, {});
  },
};
