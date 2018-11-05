var sql = require("mssql");

var wmvpConfig = {
  user: 'DBAccess',
  password: 'Acce$$DB',
  server: '10.10.1.174',
  port: 65335,
  database: 'wMVP3_CapeCodMA',
  stream: true,
  encrypt: false,
  requestTimeout: 300000,
  connectionTimeout: 300000,
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 300000
  }
}

sql.connect(wmvpConfig, err => {

  new sql.Request().query('select * from dbo.wiz_treatment_towns', (err, result) => {

    console.log(result.recordset)
    console.log(err)
  })
})