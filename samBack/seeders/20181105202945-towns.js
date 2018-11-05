'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('wiz_treatment_towns', [{
      wtt_scenario_id: 1234,
      wtt_treatment_id: 5678,
      wtt_town_id: 123,
      createdAt: new Date(),
      updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('wiz_treatment_towns', null, {});
  }
};