var {DB} = require('../db/db')

updateSamVote = function({scenarioid, meetingid, cap_cost, om_cost, lc_cost, growth_comp, jobs, var_perf, flood_ratio, pvla, years}) {

  return DB.executeQuery('select sam_insert(' + scenarioid + ',' + meetingid + ',' + cap_cost + ',' + om_cost + ',' + lc_cost + ',' + growth_comp + ',' + jobs + ',' + var_perf + ',' + flood_ratio + ',' + pvla + ',' + years + ')')
  .then((i) => {
    return 'OK'
  })
}

module.exports = {
  
  updateSamVote: updateSamVote
}