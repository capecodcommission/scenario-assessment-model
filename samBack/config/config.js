require('dotenv').config();

module.exports = {
  development: {
    host: process.env.DEVHOST,
    port: process.env.DEVPORT,
    database: process.env.DEVDB,
    username: process.env.DEVUSER,
    password: process.env.DEVPASSWORD,
    dialect: 'postgresql',
    seederStorage: 'sequelize',
    logging:false,
    pool: {
      max: 5,
      min: 0,
      idle: 20000,
      acquire: 20000
    },
    define: {
      freezeTableName: true,
      timestamps: false
    }
  },
  test: {
    host: process.env.TESTHOST,
    port: process.env.TESTPORT,
    database: process.env.TESTDB,
    username: process.env.TESTUSER,
    password: process.env.TESTPASSWORD,
    dialect: 'postgresql'
  },
  production: {
    host: process.env.PRODHOST,
    port: process.env.PRODPORT,
    database: process.env.PRODDB,
    username: process.env.PRODUSER,
    password: process.env.PRODPASSWORD,
    dialect: 'postgresql',
    logging: false
  },
  wmvpConfig: {
    user: 'DBAccess',
    password: 'Acce$$DB',
    server: '10.10.1.174',
    port: '65335',
    database: 'wMVP3_CapeCodMA',
    stream: true,
    requestTimeout: 3000000,
    connectionTimeout: 3000000,
    pool: {
      max: 1000000,
      min: 1,
      idleTimeoutMillis: 3000000,
      evictionRunIntervalMillis: 5,
      softIdleTimeoutMillis: 5
    }
  }
};