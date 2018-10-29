require('dotenv').config();

module.exports = {
  development: {
    host: process.env.DEVHOST,
    port: process.env.DEVPORT,
    database: process.env.DEVDB,
    username: process.env.DEVUSER,
    password: process.env.DEVPASSWORD,
    dialect: 'postgresql'
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
  }
};