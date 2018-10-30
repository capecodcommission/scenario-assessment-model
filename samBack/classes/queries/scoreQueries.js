var {Scenario} = require('../objects/Scenario')
var {Scores} = require('../objects/Scores')
var {setPercentiles} = require('../helpers/setPercentiles')

getScores = async function({id}) {

  const a = new Scenario(id)
  const b = new Scores(id)
  let scenarioData = await a.getScenarioData()
  const techMatrix = await a.getAllTechMatrixData()
  const treatmentsData = await a.getTreatmentsData()

  scenarioData = scenarioData[0]
  a.areaName = scenarioData.AreaName
  a.areaID = scenarioData.AreaID

  const winData = await a.getWINData()
  const nConversionData = await a.getNConversionData()

  scenarioData.Nload_Reduction_Attenuation = scenarioData.Nload_Reduction_Attenuation || 0
  scenarioData.Nload_Reduction_InEmbay = scenarioData.Nload_Reduction_InEmbay || 0
  scenarioData.Nload_Reduction_Fert = scenarioData.Nload_Reduction_Fert || 0
  scenarioData.Nload_Reduction_GW = scenarioData.Nload_Reduction_GW || 0
  scenarioData.Nload_Reduction_InEmbay = scenarioData.Nload_Reduction_InEmbay || 0
  scenarioData.Nload_Reduction_Septic = scenarioData.Nload_Reduction_Septic || 0
  scenarioData.Nload_Reduction_SW = scenarioData.Nload_Reduction_SW || 0
  a.treatmentIDCustomArray = []

  treatmentsData.map((i) => {
    a.treatmentIDCustomArray.push(i.TreatmentID)
  })

  b.nReducInEmbay = parseFloat(scenarioData.Nload_Reduction_InEmbay)
  b.embayNCalc = parseFloat(scenarioData.Nload_Calculated_InEmbay)
  b.nReducTotal = parseFloat(scenarioData.Nload_Reduction_Attenuation) + parseFloat(scenarioData.Nload_Reduction_Fert) + parseFloat(scenarioData.Nload_Reduction_GW) + parseFloat(scenarioData.Nload_Reduction_InEmbay) + parseFloat(scenarioData.Nload_Reduction_Septic) + parseFloat(scenarioData.Nload_Reduction_SW)
  b.treatments = treatmentsData
  b.techMatrix = techMatrix

  // Get percentiles from helper function, passing tech matrix and nreduc total calculated above
  var percentiles = setPercentiles(techMatrix, b.nReducTotal)

  b.capPercentile = percentiles[0]
  b.omPercentile = percentiles[1]
  b.lcPercentile = percentiles[2]
  b.perfPercentile = percentiles[3]
  b.yearsPercentile = percentiles[4]
  b.jobsPercentile = percentiles[5]

  b.tblWinArray = winData
  b.nConversion = nConversionData
  
  return b
}

module.exports = {
  
  getScores: getScores
}