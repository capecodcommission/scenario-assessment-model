'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('parcelMaster', {
      row_id: {
        type: Sequelize.INTEGER
      },
      parcel_id: {
        type: Sequelize.TEXT
      },
      town_id: {
        type: Sequelize.INTEGER
      },
      subwater_id: {
        type: Sequelize.INTEGER
      },
      treatment_id: {
        type: Sequelize.INTEGER
      },
      treatment_type: {
        type: Sequelize.INTEGER
      },
      treatment_class: {
        type: Sequelize.STRING
      },
      treatment_name: {
        type: Sequelize.STRING
      },
      scenario_id: {
        type: Sequelize.INTEGER
      },
      ww_class: {
        type: Sequelize.TEXT
      },
      geo_point: {
        type: Sequelize.TEXT
      },
      ww_flow: {
        type: Sequelize.FLOAT
      },
      init_nload_septic: {
        type: Sequelize.FLOAT
      },
      init_nload_fert: {
        type: Sequelize.FLOAT
      },
      init_nload_storm: {
        type: Sequelize.FLOAT
      },
      init_nload_atmosphere: {
        type: Sequelize.FLOAT
      },
      init_nload_total: {
        type: Sequelize.FLOAT
      },
      att_init_nload_total: {
        type: Sequelize.FLOAT
      },
      running_nload_septic: {
        type: Sequelize.FLOAT
      },
      running_nload_fert: {
        type: Sequelize.FLOAT
      },
      running_nload_storm: {
        type: Sequelize.FLOAT
      },
      running_nload_atmoshere: {
        type: Sequelize.FLOAT
      },
      running_nload_total: {
        type: Sequelize.FLOAT
      },
      att_running_nload_total: {
        type: Sequelize.FLOAT
      },
      running_nload_treated: {
        type: Sequelize.FLOAT
      },
      running_nload_removed: {
        type: Sequelize.FLOAT
      },
      final_nload_septic: {
        type: Sequelize.FLOAT
      },
      final_nload_fert: {
        type: Sequelize.FLOAT
      },
      final_nload_storm: {
        type: Sequelize.FLOAT
      },
      final_nload_atmosphere: {
        type: Sequelize.FLOAT
      },
      final_nload_total: {
        type: Sequelize.FLOAT
      },
      att_final_nload_total: {
        type: Sequelize.FLOAT
      },
      final_nload_treated: {
        type: Sequelize.FLOAT
      },
      final_nload_removed: {
        type: Sequelize.FLOAT
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('parcelMaster');
  }
};