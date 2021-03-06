var {Scenario} = require('../objects/Scenario')
var {Scores} = require('../objects/Scores')
var {setPercentiles} = require('../helpers/setPercentiles')

getScores = function({id}) {

  var a = new Scenario(id)
  var b = new Scores(id)

  return Promise.all([
    a.getAllTechMatrixData(),
    a.getAllTechnologiesData(),
    a.getScenarioData(),
    a.getTreatmentsData()
  ])
  .then(function ([
    techMatrix,
    technologies,
    scenarioData,
    treatmentsData
  ]) {

    scenarioData = scenarioData.recordset[0]

    a.areaName = scenarioData.AreaName
    a.areaID = scenarioData.AreaID
    a.nReducInEmbay = scenarioData.Nload_Reduction_InEmbay
    a.treatmentIDCustomArray = []

    treatmentsData.recordset.map((i) => {
      a.treatmentIDCustomArray.push(i.TreatmentID)
    })

    b.embayNCalc = scenarioData.Nload_Calculated_InEmbay
    b.nReducTotal = scenarioData.Nload_Reduction_Attenuation + scenarioData.Nload_Reduction_Fert + scenarioData.Nload_Reduction_GW + scenarioData.Nload_Reduction_InEmbay + scenarioData.Nload_Reduction_Septic + scenarioData.Nload_Reduction_SW
    b.treatments = treatmentsData.recordset
    b.techMatrix = techMatrix.recordset
    b.technologies = technologies.recordset

    // Get percentiles from helper function, passing tech matrix, technologies tables and nreduc total calculated above
    var percentiles = setPercentiles(techMatrix, technologies, b.nReducTotal)

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

      b.tblWinArray = winData.recordset
      b.ftCoeffArray = ftCoeffData.recordset
      b.nConversion = nConversionData.recordset[0]
      
      return b
    })
  })
}

module.exports = {
  
  getScores: getScores
}