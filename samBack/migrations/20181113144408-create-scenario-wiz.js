'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Scenario_Wiz', {
      ScenarioID: {
        type: Sequelize.INTEGER
      },
      CreateDate: {
        type: Sequelize.STRING
      },
      UpdateDate: {
        type: Sequelize.STRING
      },
      Deleted: {
        type: Sequelize.BOOLEAN
      },
      CreatedBy: {
        type: Sequelize.STRING
      },
      ScenarioName: {
        type: Sequelize.STRING
      },
      ScenarioDescription: {
        type: Sequelize.STRING
      },
      ScenarioNotes: {
        type: Sequelize.TEXT
      },
      AreaType: {
        type: Sequelize.STRING
      },
      AreaID: {
        type: Sequelize.INTEGER
      },
      AreaName: {
        type: Sequelize.STRING
      },
      Nload_Existing: {
        type: Sequelize.FLOAT
      },
      Nload_Sept: {
        type: Sequelize.FLOAT
      },
      Nload_Fert: {
        type: Sequelize.FLOAT
      },
      Nload_Storm: {
        type: Sequelize.FLOAT
      },
      Total_Parcels: {
        type: Sequelize.INTEGER
      },
      Total_WaterUse: {
        type: Sequelize.FLOAT
      },
      Total_WaterFlow: {
        type: Sequelize.FLOAT
      },
      Nload_Sept_Target: {
        type: Sequelize.FLOAT
      },
      Nload_Total_Target: {
        type: Sequelize.FLOAT
      },
      Nload_Calculated_Total: {
        type: Sequelize.FLOAT
      },
      Cost_Total: {
        type: Sequelize.FLOAT
      },
      Cost_Capital: {
        type: Sequelize.FLOAT
      },
      Cost_OM: {
        type: Sequelize.FLOAT
      },
      Cost_Collection: {
        type: Sequelize.FLOAT
      },
      Cost_TransportDisposal: {
        type: Sequelize.FLOAT
      },
      Cost_NonConstruction: {
        type: Sequelize.FLOAT
      },
      Cost_Monitor: {
        type: Sequelize.FLOAT
      },
      ScenarioPeriod: {
        type: Sequelize.STRING
      },
      POLY_STRING: {
        type: Sequelize.TEXT
      },
      ScenarioAcreage: {
        type: Sequelize.FLOAT
      },
      Nload_Calculated_Fert: {
        type: Sequelize.FLOAT
      },
      Nload_Calculated_SW: {
        type: Sequelize.FLOAT
      },
      Nload_Calculated_Septic: {
        type: Sequelize.FLOAT
      },
      Nload_Calculated_GW: {
        type: Sequelize.FLOAT
      },
      Nload_Calculated_InEmbay: {
        type: Sequelize.FLOAT
      },
      Nload_Calculated_Attenuation: {
        type: Sequelize.FLOAT
      },
      Nload_Reduction_Fert: {
        type: Sequelize.FLOAT
      },
      Nload_Reduction_SW: {
        type: Sequelize.FLOAT
      },
      Nload_Reduction_Septic: {
        type: Sequelize.FLOAT
      },
      Nload_Reduction_GW: {
        type: Sequelize.FLOAT
      },
      Nload_Reduction_Attenuation: {
        type: Sequelize.FLOAT
      },
      Nload_Reduction_InEmbay: {
        type: Sequelize.FLOAT
      },
      ScenarioProgress: {
        type: Sequelize.INTEGER
      },
      ScenarioComplete: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      deleted_at: {
        type: Sequelize.DATE
      },
      parcels_septic: {
        type: Sequelize.INTEGER
      },
      parcels_sewer: {
        type: Sequelize.INTEGER
      },
      parcels_gwdp: {
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Scenario_Wiz');
  }
};