"use strict";
const desa = require("./sources/desa.js");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert("Desa", desa);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("Desa", null, {});
  },
};
