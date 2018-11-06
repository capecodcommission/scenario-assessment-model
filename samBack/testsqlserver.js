var sql = require("mssql");

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

var wmvpConnect = new sql.ConnectionPool(wmvpConfig)

Promise.all([
  wmvpConnect.connect()
]).then(([]) => {

  var request = new sql.Request(wmvpConnect)

  request.query('select * from dbo.wiz_treatment_towns')
  .then((result) => {

    console.log(result.recordset[0])
  })
})