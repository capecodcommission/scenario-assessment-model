var {Scenario} = require('../objects/Scenario')
var {Summary} = require('../objects/Summary')
var {Town} = require('../objects/Town')
var {SubEmbayment} = require('../objects/SubEmbayment')
var {Treatment} = require('../objects/Treatment')

getSummary = function({id}) {

  var a = new Scenario(id)
  var b = new Summary(id)

  a.treatmentIDCustomArray = []
  b.towns = []
  b.treatments = []
  b.subEmbayments = []

  return Promise.all([
    a.getScenarioData(),
    a.getScenarioTownNames(),
    a.getTreatmentsData()
  ])
  .then(function ([
    scenarioData,
    townNames,
    treatments
  ]) {

    a.areaID = scenarioData.recordset[0].AreaID

    townNames.recordset.map((i) => {
      b.towns.push(new Town(i.TOWN))
    })  

    treatments.recordset.map((i) => {
      var treatment = new Treatment(i.TreatmentType_ID)
      treatment.treatmentName = i.TreatmentType_Name
      a.treatmentIDCustomArray.push(i.TreatmentID)
      b.treatments.push(treatment)
    })

    return Promise.all([
      a.getScenarioSubembaymentNames()
    ])
    .then(function ([
      subEmbaymentNames
    ]) {

      subEmbaymentNames.recordset.map((i) => {
        b.subEmbayments.push(new SubEmbayment(i.SUBEM_DISP))
      })

      return b
    })
  })
}

module.exports = {
  
  getSummary: getSummary
}