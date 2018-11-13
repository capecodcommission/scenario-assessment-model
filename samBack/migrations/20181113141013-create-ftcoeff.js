'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FTCoeff', {
      FTC_ID: {
        type: Sequelize.INTEGER
      },
      EMBAY_ID: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      EMBAY_NAME: {
        type: Sequelize.STRING,
        allowNull: true
      },
      EMBAY_DISP: {
        type: Sequelize.STRING,
        allowNull: true
      },
      SUBEM_ID: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      SUBEM_NAME: {
        type: Sequelize.STRING,
        allowNull: true
      },
      SUBEM_DISP: {
        type: Sequelize.STRING,
        allowNull: true
      },
      SUBWATER_ID: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      SUBWATER_NAME: {
        type: Sequelize.STRING,
        allowNull: true
      },
      SUBWATER_DISP: {
        type: Sequelize.STRING,
        allowNull: true
      },
      FLOWTHRUCOEF: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      AVERAGED: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      SUBWATER_TOTAL: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      SUBEMBAY_PCT: {
        type: Sequelize.FLOAT,
        allowNull: true
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('FTCoeff');
  }
};