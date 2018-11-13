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

const pmQuery = `
select 
  [row_id]
  ,[parcel_id]
  ,[town_id]
  ,[subwater_id]
  ,[treatment_id]
  ,[treatment_type_id]
  ,[treatment_class]
  ,[treatment_name]
  ,[scenario_id]
  ,[ww_class]
  ,convert(varchar(max),geo_point) as geo_point
  ,[ww_flow]
  ,[init_nload_septic]
  ,[init_nload_fert]
  ,[init_nload_storm]
  ,[init_nload_atmosphere]
  ,[init_nload_total]
  ,[att_init_nload_total]
  ,[running_nload_septic]
  ,[running_nload_fert]
  ,[running_nload_storm]
  ,[running_nload_atmosphere]
  ,[running_nload_total]
  ,[att_running_nload_total]
  ,[running_nload_treated]
  ,[running_nload_removed]
  ,[final_nload_septic]
  ,[final_nload_fert]
  ,[final_nload_storm]
  ,[final_nload_atmosphere]
  ,[final_nload_total]
  ,[att_final_nload_total]
  ,[final_nload_treated]
  ,[final_nload_removed]
from CapeCodMA.parcelMaster
`

Promise.all([
  wmvpConnect.connect()
]).then(([]) => {

  var request = new sql.Request(wmvpConnect)
  request.stream = true
  request.query(pmQuery)
  request.on('row', row => {
    console.log(typeof row)
  })
  request.on('done', result => {
    console.log('done')
  })

  // request.query('select * from dbo.wiz_treatment_towns')
  // .then((result) => {

  //   console.log(result.recordset[0])
  // })
})