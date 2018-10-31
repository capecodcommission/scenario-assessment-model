// Import relevant classes
const {Scenario} = require('../objects/Scenario')
const {Summary} = require('../objects/Summary')
const {Town} = require('../objects/Town')
const {SubEmbayment} = require('../objects/SubEmbayment')
const {Treatment} = require('../objects/Treatment')
const {Polygon} = require('../objects/Polygon')

// Asynchronously retreives PostgreSQL data to fill summary callouts on front-end
getSummary = async function({id}) {

  // Initialize classes and associated arrays
  let a = new Scenario(id)
  let b = new Summary(id)
  a.treatmentIDCustomArray = []
  b.towns = []
  b.treatments = []
  b.subEmbayments = []

  // Retrieve relevant data, fill properties for additional queries below
  const scenarioData = await a.getScenarioData()
  const townNames = await a.getScenarioTownNames()
  const treatments = await a.getTreatmentsData()
  a.areaID = scenarioData[0].AreaID
  b.embaymentName = scenarioData[0].AreaName
  townNames.map((i) => {
    b.towns.push(new Town(i.TOWN))
  })  

  // Init treatment class, fill properties 
  treatments.map((i) => {
    let treatment = new Treatment(i.TreatmentType_ID)
    treatment.treatmentName = i.TreatmentType_Name
    treatment.treatmentPolyString = new Polygon(i.POLY_STRING.type,i.POLY_STRING.coordinates)
    treatment.treatmentClass = i.Treatment_Class
    a.treatmentIDCustomArray.push(i.TreatmentID)
    b.treatments.push(treatment)
  })

  // Retrieve additional data using filled scenario properties from above
  const subEmbaymentNames = await a.getScenarioSubembaymentNames()
  const tmdl = await a.getTMDL()

  // Fill properties from requests above
  b.progressTMDL = tmdl[0].progress
  subEmbaymentNames.map((i) => {
    b.subEmbayments.push(new SubEmbayment(i.subem_disp))
  })

  return b
}

module.exports = {
  
  getSummary: getSummary
}