const Sequelize = require('sequelize')

class DB {
  constructor (sequelize) {
    this.sequelize = sequelize
  }
  connect() {
    this.sequelize.authenticate()
    .then(() => {
      console.log('connected')
    })
    .catch((err) => {
      console.log('error',err)
    })
  }
  executeQuery(query) {
    return this.sequelize.query(query)
  }
}

const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/SAM_GEODB');
var initDB = new DB(sequelize)
initDB.connect()

module.exports = {
  DB: initDB
}