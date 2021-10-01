"use strict";
const kabupaten = require("./sources/kabupaten.js");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert("Kabupaten", kabupaten);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("Kabupaten", null, {});
  },
};
