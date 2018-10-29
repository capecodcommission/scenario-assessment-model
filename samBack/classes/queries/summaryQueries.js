var {Scenario} = require('../objects/Scenario')
var {Summary} = require('../objects/Summary')
var {Town} = require('../objects/Town')
var {SubEmbayment} = require('../objects/SubEmbayment')
var {Treatment} = require('../objects/Treatment')
var {Polygon} = require('../objects/Polygon')

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

    a.areaID = scenarioData[0].AreaID
    b.embaymentName = scenarioData[0].AreaName

    townNames.map((i) => {

      b.towns.push(new Town(i.TOWN))
    })  

    treatments.map((i) => {

      var treatment = new Treatment(i.TreatmentType_ID)
      treatment.treatmentName = i.TreatmentType_Name
      treatment.treatmentPolyString = new Polygon(i.POLY_STRING.type,i.POLY_STRING.coordinates)
      treatment.treatmentClass = i.Treatment_Class
      a.treatmentIDCustomArray.push(i.TreatmentID)
      b.treatments.push(treatment)
    })

    return Promise.all([
      a.getScenarioSubembaymentNames(),
      a.getTMDL()
    ])
    .then(function ([
      subEmbaymentNames,
      tmdl
    ]) {

      b.progressTMDL = tmdl[0].progress

      subEmbaymentNames.map((i) => {
        
        b.subEmbayments.push(new SubEmbayment(i.SUBEM_DISP))
      })

      return b
    })
  })
}

module.exports = {
  
  getSummary: getSummary
}