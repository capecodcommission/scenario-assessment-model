var {DB} = require('../db/db')

insertSamVote = function({scenarioid, meetingid, cap_cost, om_cost, lc_cost, growth_comp, jobs, var_perf, flood_ratio, pvla, years}) {
  return DB.executeQuery('select sam_insert(' + scenarioid + ',' + meetingid + ',' + cap_cost + ',' + om_cost + ',' + lc_cost + ',' + growth_comp + ',' + jobs + ',' + var_perf + ',' + flood_ratio + ',' + pvla + ',' + years + ')')
  .then(() => {
    return true
  })
}

module.exports = {
  
  insertSamVote: insertSamVote
}