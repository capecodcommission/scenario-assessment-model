'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('wiz_treatment_towns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      wtt_scenario_id: {
        type: Sequelize.INTEGER
      },
      wtt_treatment_id: {
        type: Sequelize.INTEGER
      },
      wtt_town_id: {
        type: Sequelize.INTEGER
      },
      wtt_tot_parcels: {
        type: Sequelize.INTEGER
      },
      wtt_wu_parcels: {
        type: Sequelize.INTEGER
      },
      wtt_att_n_removed: {
        type: Sequelize.FLOAT
      },
      wtt_unatt_n_removed: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('wiz_treatment_towns');
  }
};