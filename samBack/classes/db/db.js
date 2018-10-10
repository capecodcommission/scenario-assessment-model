var sql = require("mssql");

class DB {

  constructor (wmvp3Connect, tmConnect) {

    this.wmvp3Connect = wmvp3Connect
    this.tmConnect = tmConnect
  }
  
  // Execute query to connection pools
  executeQuery(query, connection) {
  
    var request = new sql.Request(connection)
  
    return request.query(query)
  }
}

var wmvpConfig = {
  user: 'DBAccess',
  password: 'Acce$$DB',
  server: '10.10.1.174',
  port: '65335',
  database: 'wMVP3_CapeCodMA',
  stream: true,
  requestTimeout: 300000,
  connectionTimeout: 300000,
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 300000
  }
}

var tmConfig = {
  user: 'DBAccess',
  password: 'Acce$$DB',
  server: '10.10.1.174',
  port: '65335',
  database: 'Tech_Matrix',
  stream: true,
  requestTimeout: 300000,
  connectionTimeout: 300000,
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 300000
  }
}

var wmvpConnect = new sql.ConnectionPool(wmvpConfig)
var tmConnect = new sql.ConnectionPool(tmConfig)

var initDB = new DB(wmvpConnect, tmConnect)
initDB.wmvp3Connect.connect()
initDB.tmConnect.connect()

module.exports = {
  
  DB: initDB
}