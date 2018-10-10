var {Scenario} = require('../objects/Scenario')
var {Scores} = require('../objects/Scores')

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

    b.treatments = treatmentsData.recordset
    b.techMatrix = techMatrix.recordset
    b.technologies = technologies.recordset
    b.nReducTotal = scenarioData.Nload_Reduction_Attenuation + scenarioData.Nload_Reduction_Fert + scenarioData.Nload_Reduction_GW + scenarioData.Nload_Reduction_InEmbay + scenarioData.Nload_Reduction_Septic + scenarioData.Nload_Reduction_SW

    return b
  })
}

module.exports = {
  
  getScores: getScores
}