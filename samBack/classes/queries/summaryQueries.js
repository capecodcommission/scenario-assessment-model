var {Scenario} = require('../objects/Scenario')
var {Summary} = require('../objects/Summary')
var {Town} = require('../objects/Town')
var {SubEmbayment} = require('../objects/SubEmbayment')
var {Treatment} = require('../objects/Treatment')
var {Polygon} = require('../objects/Polygon')

getSummary = async function({id}) {

  var a = new Scenario(id)
  var b = new Summary(id)

  a.treatmentIDCustomArray = []
  b.towns = []
  b.treatments = []
  b.subEmbayments = []

  const scenarioData = await a.getScenarioData()
  const townNames = await a.getScenarioTownNames()
  const treatments = await a.getTreatmentsData()

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

  const subEmbaymentNames = await a.getScenarioSubembaymentNames()
  const tmdl = await a.getTMDL()

    b.progressTMDL = tmdl[0].progress

    subEmbaymentNames.map((i) => {
      
      b.subEmbayments.push(new SubEmbayment(i.SUBEM_DISP))
    })

    return b
}

module.exports = {
  
  getSummary: getSummary
}