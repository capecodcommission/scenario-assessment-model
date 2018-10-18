var {Scenario} = require('../objects/Scenario')
var {Scores} = require('../objects/Scores')
var {setPercentiles} = require('../helpers/setPercentiles')

getScores = function({id}) {

  var a = new Scenario(id)
  var b = new Scores(id)

  return Promise.all([
    a.getAllTechMatrixData(),
    a.getScenarioData(),
    a.getTreatmentsData()
  ])
  .then(function ([
    techMatrix,
    scenarioData,
    treatmentsData
  ]) {

    scenarioData = scenarioData[0][0]
    scenarioData.Nload_Reduction_Attenuation = scenarioData.Nload_Reduction_Attenuation || 0
    scenarioData.Nload_Reduction_InEmbay = scenarioData.Nload_Reduction_InEmbay || 0
    scenarioData.Nload_Reduction_Fert = scenarioData.Nload_Reduction_Fert || 0
    scenarioData.Nload_Reduction_GW = scenarioData.Nload_Reduction_GW || 0
    scenarioData.Nload_Reduction_InEmbay = scenarioData.Nload_Reduction_InEmbay || 0
    scenarioData.Nload_Reduction_Septic = scenarioData.Nload_Reduction_Septic || 0
    scenarioData.Nload_Reduction_SW = scenarioData.Nload_Reduction_SW || 0

    a.areaName = scenarioData.AreaName
    a.areaID = scenarioData.AreaID
    a.nReducInEmbay = parseFloat(scenarioData.Nload_Reduction_InEmbay)
    a.treatmentIDCustomArray = []

    treatmentsData[0].map((i) => {
      a.treatmentIDCustomArray.push(i.TreatmentID)
    })

    b.embayNCalc = parseFloat(scenarioData.Nload_Calculated_InEmbay)
    b.nReducTotal = parseFloat(scenarioData.Nload_Reduction_Attenuation) + parseFloat(scenarioData.Nload_Reduction_Fert) + parseFloat(scenarioData.Nload_Reduction_GW) + parseFloat(scenarioData.Nload_Reduction_InEmbay) + parseFloat(scenarioData.Nload_Reduction_Septic) + parseFloat(scenarioData.Nload_Reduction_SW)
    b.treatments = treatmentsData[0]
    b.techMatrix = techMatrix[0]

    // Get percentiles from helper function, passing tech matrix and nreduc total calculated above
    var percentiles = setPercentiles(techMatrix[0], b.nReducTotal)

    b.capPercentile = percentiles[0]
    b.omPercentile = percentiles[1]
    b.lcPercentile = percentiles[2]
    b.perfPercentile = percentiles[3]
    b.yearsPercentile = percentiles[4]
    b.jobsPercentile = percentiles[5]

    return Promise.all([
      a.getWINData(),
      a.getFTCoeffData(),
      a.getNConversionData()
    ])
    .then(function ([
      winData,
      ftCoeffData,
      nConversionData
    ]) {

      b.tblWinArray = winData[0]
      b.ftCoeffArray = ftCoeffData[0]
      b.nConversion = nConversionData[0]
      
      return b
    })
  })
}

module.exports = {
  
  getScores: getScores
}