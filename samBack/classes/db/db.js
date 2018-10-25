const Sequelize = require('sequelize')
const config = require('../../config')

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

const sequelize = new Sequelize(config.development);
var initDB = new DB(sequelize)
initDB.connect()

module.exports = {
  DB: initDB
}